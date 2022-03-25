import '../../lib/websocket.bundle.js';

declare var Paho: any;

export type MqttOptionsType = {
  userName: string;
  password: string;
  useSSL: boolean;
  cleanSession: boolean;
  mqttVersion: number;
  reconnect: boolean;
};

type ClientManagerType = {
  session: any,
  successHandler: Function | null,
  stopHandler: Function | null,
  errorHandler: Function | null
}

type SessionReturnType = {
  isConnected: boolean;
  message: string;
};

export default class MQTT {
  ClientManager: ClientManagerType;

  constructor() {
    // Others.addDependencies('./lib/paho-mqtt.js', 'paho-mqtt');

    this.ClientManager = {
      session: null,
      successHandler: null,
      stopHandler: null,
      errorHandler: null
    }
  }

  public Start(broker: string, port: number, connectionOptions: MqttOptionsType, callback: (data: SessionReturnType) => void) {
    const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8);
    const client = new Paho.MQTT.Client(broker, port, clientId);

    const SuccessHandler = ((callback: (data: SessionReturnType) => void) => {
      this.ClientManager.session = client;
      callback({ isConnected: true, message: 'Session started' });
    }).bind(this, callback);

    const FailureHandler = ((callback: (data: SessionReturnType) => void) => {
      callback({ isConnected: false, message: 'Session failed' });
    }).bind(null, callback);

    //* onFailure tem um parâmetro de retorno (msg);
    const options = { ...connectionOptions, onSuccess: SuccessHandler, onFailure: FailureHandler };
    client.connect(options);
  }

  public Stop() {
    if (this.ClientManager.session != null) {
      this.ClientManager.session.disconnect();
      this.ClientManager.session = null;

      console.log('Session stopped.');
    }
    else {
      console.log('Session is not started.');
    }
  }

  public ConnectChannel(topic: string, msgCallback: Function) {
    if (topic != '') {
      this.ClientManager.session.onMessageArrived = (msgArrived: any) => {
        const message = JSON.parse(msgArrived.payloadString);
        msgCallback(message);
      };

      this.ClientManager.session.onConnectionLost = (responseObject: any) => {
        console.log('Connection lost', responseObject);
      };

      const onSuccess = (a: any) => {
        console.log('Connected to channel.', a);
      };

      const onFailure = (a: any) => {
        console.log('Failure on connecting to channel.', a);
      };

      const options = { onSuccess: onSuccess, onFailure: onFailure };
      this.ClientManager.session.subscribe(topic, options);
    }
  }

  public DisconnectChannel(topic: string) {
    if (topic != '') {
      const onSuccess = (a: any) => {
        console.log('Disconnected from channel.', a);
      }

      const onFailure = (a: any) => {
        console.log('Failure on disconnecting from channel.', a);
      }

      const options = {
        onSuccess: onSuccess,
        onFailure: onFailure
      }

      this.ClientManager.session.unsubscribe(topic, options);
    }
  }
}