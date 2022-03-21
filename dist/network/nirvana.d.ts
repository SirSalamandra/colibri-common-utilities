declare type SessionReturnType = {
    isConnected: boolean;
    message: string;
};
declare type ChannelErrorType = {
    Connected: boolean;
    ErroType: string;
    Message: string;
};
export default class NirvanaConnection {
    private SessionManager;
    private ChannelsManage;
    constructor();
    StartSession(realms: string[], callback: (data: SessionReturnType) => void): void;
    StopSession(callback: Function): void;
    ConnectChannel(name: string, filters: string | string[], startMessage: number | undefined, msgCallback: Function, errorCallback: (data: ChannelErrorType) => void): void;
    DisconnectChannel(name: string, callback?: Function): void;
    private ShuffleRealms;
    private DisconnectAllChannels;
    private HandleFilters;
    private ProcessChannelMessage;
}
export {};
//# sourceMappingURL=nirvana.d.ts.map