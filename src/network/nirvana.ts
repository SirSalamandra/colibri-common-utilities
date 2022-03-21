import Others from '../others';
declare var Nirvana: any;

type SessionConfigType = {
  realms: any;
  drivers: string[];
  debugLevel: number
};

type SessionReturnType = {
  isConnected: boolean;
  message: string;
};

type SessionManagerType = {
  session: any,
  successHandler: Function | null,
  stopHandler: Function | null,
  errorHandler: Function | null,
  disconnectHandler: Function | null,
}

type ChannelErrorType = {
  Connected: boolean;
  ErroType: string;
  Message: string;
}

export default class NirvanaConnection {
  private SessionManager: SessionManagerType;
  private ChannelsManage = new Map<string, { channel: any, messageHandler: Function, errorHandler: Function }>();

  constructor() {
    Others.addDependencies('./lib/nirvana.js', 'nirvana-script');

    this.SessionManager = {
      session: null,
      successHandler: null,
      stopHandler: null,
      errorHandler: null,
      disconnectHandler: null
    }
  }

  public StartSession(realms: string[], callback: (data: SessionReturnType) => void) {
    try {
      if (this.SessionManager.session != null) {
        throw new Error('Session is already started. Just one session is allowed at time.');
      }
      else {
        const sessionConfig: SessionConfigType = {
          realms: this.ShuffleRealms(realms),
          debugLevel: 4,
          drivers: [Nirvana.Driver.WEBSOCKET]
        }

        const SuccessHandler = ((callback: (data: SessionReturnType) => void) => {
          callback({ isConnected: true, message: 'Session started' });
        }).bind(null, callback);

        const StopHandler = () => {
          console.log('Session Stop Handler - Session stopped.',);
        };

        const ErrorHandler = (session: any, ex: any) => {
          console.log('Session Error Handler - Session error:', ex);
        };

        const DisconnectHandler = () => {
          console.log('Session Disconnect Handler');
        }

        const session = Nirvana.createSession(sessionConfig);

        session.on(Nirvana.Observe.START, SuccessHandler);
        session.on(Nirvana.Observe.STOP, StopHandler);
        session.on(Nirvana.Observe.ERROR, ErrorHandler);
        session.on(Nirvana.Observe.DISCONNECT, DisconnectHandler);

        session.start();

        this.SessionManager.session = session;
        this.SessionManager.successHandler = SuccessHandler;
        this.SessionManager.stopHandler = StopHandler;
        this.SessionManager.errorHandler = ErrorHandler;
        this.SessionManager.disconnectHandler = DisconnectHandler;
      }
    }
    catch (error: any) {
      callback({ isConnected: false, message: error.message });
    }
  }

  public StopSession(callback: Function) {
    //TODO: Encontrar uma forma melhor para notificar erros.    
    if (this.SessionManager.session == null) {
      console.log('Stop Session - Session is not started.');
    }
    else {
      this.DisconnectAllChannels();

      const session = this.SessionManager.session;
      session.removeListener(Nirvana.Observe.START, this.SessionManager.successHandler);
      session.removeListener(Nirvana.Observe.STOP, this.SessionManager.stopHandler);
      session.removeListener(Nirvana.Observe.ERROR, this.SessionManager.errorHandler);
      session.removeListener(Nirvana.Observe.DISCONNECT, this.SessionManager.disconnectHandler);

      session.stop();

      this.SessionManager.session = null;

      console.log('Stop Session - Session stopped.');
    }

    callback();
  }

  public ConnectChannel(name: string, filters: string | string[], startMessage: number = 0, msgCallback: Function, errorCallback: (data: ChannelErrorType) => void) {
    if (this.SessionManager.session == null) return;

    const channel = this.SessionManager.session.getChannel(name);
    const filter = this.HandleFilters(filters);

    if (startMessage > 0) channel.setStartEID(startMessage);
    if (filter != '') channel.setFilter(this.HandleFilters(filters));

    const MessageHandler = this.ProcessChannelMessage.bind(this, msgCallback);

    const ErrorHandler = ((errorCallback: (data: ChannelErrorType) => void, session: any, exception: any) => {
      let errorMessage = exception.name;

      //* MissingResourceException -> channel not found
      if (errorMessage == 'MissingResourceException') {
        this.DisconnectChannel(exception.resourceName, () => {
          errorCallback({
            Connected: false,
            ErroType: 'ChannelNotFound',
            Message: exception.message
          });
        });
      }
    }).bind(this, errorCallback);

    channel.on(Nirvana.Observe.DATA, MessageHandler);
    channel.on(Nirvana.Observe.ERROR, ErrorHandler);
    channel.subscribe();

    this.ChannelsManage.set(name, {
      channel: channel,
      messageHandler: MessageHandler,
      errorHandler: ErrorHandler
    });
  }

  public DisconnectChannel(name: string, callback?: Function) {
    if (this.ChannelsManage.has(name)) {
      const channel = this.ChannelsManage.get(name)!.channel;

      channel.removeListener(Nirvana.Observe.DATA, this.ChannelsManage.get(name)!.messageHandler);
      channel.removeListener(Nirvana.Observe.ERROR, this.ChannelsManage.get(name)!.errorHandler);
      channel.unsubscribe();

      this.ChannelsManage.delete(name);

      console.log(`Disconnect Channel - Channel ${name} disconnected.`);

      if (callback != null) callback(true);
    }
    //TODO: Encontrar uma forma melhor para notificar erros.
    else console.log(`Disconnect Channel - Channel ${name} not found.`);
  }

  private ShuffleRealms(realms: string[]): string[] {
    if (realms.length <= 1) return realms;

    const totalRealms = realms.length;

    const index = (Math.floor(Math.random() * totalRealms) + 1) - 1;
    const randomizedServers: Array<string> = [
      realms.splice(index, 1)[0],
      ...realms
    ];

    return randomizedServers;
  }

  private DisconnectAllChannels() {
    for (let [key, value] of this.ChannelsManage) {
      this.DisconnectChannel(key);
    }
  }

  private HandleFilters(filter: string | string[]) {
    let newFilter: string;

    if (typeof filter === 'string') {
      newFilter = filter;
    }
    else {
      if (filter.length > 0) {
        newFilter = '(' + filter.join(') AND (') + ')';
      }
      else newFilter = filter[0];
    }

    return newFilter;
  }

  private ProcessChannelMessage(callback: Function, e: any) {
    const dictionary = e.getDictionary();
    const eventId = e.eventID[1];

    let newObj: any = {};

    for (var prop in dictionary.innerProperties) {
      newObj[prop] = dictionary.get(prop);
    }

    newObj.EventId = eventId;
    newObj.Channel = e.resourceName;

    callback(newObj);
  }
}