import '../../lib/websocket.bundle.js';
export declare type MqttOptionsType = {
    userName: string;
    password: string;
    useSSL: boolean;
    cleanSession: boolean;
    mqttVersion: number;
    reconnect: boolean;
};
declare type ClientManagerType = {
    session: any;
    successHandler: Function | null;
    stopHandler: Function | null;
    errorHandler: Function | null;
};
declare type SessionReturnType = {
    isConnected: boolean;
    message: string;
};
export default class MQTT {
    ClientManager: ClientManagerType;
    constructor();
    Start(broker: string, port: number, connectionOptions: MqttOptionsType, callback: (data: SessionReturnType) => void): void;
    Stop(): void;
    ConnectChannel(topic: string, msgCallback: Function): void;
    DisconnectChannel(topic: string): void;
}
export {};
//# sourceMappingURL=mqtt.d.ts.map