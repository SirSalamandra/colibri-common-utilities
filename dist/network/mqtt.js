// import Others from '../others';
import '../../lib/websocket.bundle.js';
export default class MQTT {
    constructor() {
        // Others.addDependencies('./lib/paho-mqtt.js', 'paho-mqtt');
        this.ClientManager = {
            session: null,
            successHandler: null,
            stopHandler: null,
            errorHandler: null
        };
    }
    Start(broker, port, connectionOptions, callback) {
        const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8);
        const client = new Paho.MQTT.Client(broker, port, clientId);
        const SuccessHandler = ((callback) => {
            this.ClientManager.session = client;
            callback({ isConnected: true, message: 'Session started' });
        }).bind(this, callback);
        const FailureHandler = ((callback) => {
            callback({ isConnected: false, message: 'Session failed' });
        }).bind(null, callback);
        //* onFailure tem um parâmetro de retorno (msg);
        const options = { ...connectionOptions, onSuccess: SuccessHandler, onFailure: FailureHandler };
        client.connect(options);
    }
    Stop() {
        if (this.ClientManager.session != null) {
            this.ClientManager.session.disconnect();
            this.ClientManager.session = null;
            console.log('Session stopped.');
        }
        else {
            console.log('Session is not started.');
        }
    }
    ConnectChannel(topic, msgCallback) {
        if (topic != '') {
            this.ClientManager.session.onMessageArrived = (msgArrived) => {
                const message = JSON.parse(msgArrived.payloadString);
                msgCallback(message);
            };
            this.ClientManager.session.onConnectionLost = (responseObject) => {
                console.log('Connection lost', responseObject);
            };
            const onSuccess = (a) => {
                console.log('Connected to channel.', a);
            };
            const onFailure = (a) => {
                console.log('Failure on connecting to channel.', a);
            };
            const options = { onSuccess: onSuccess, onFailure: onFailure };
            this.ClientManager.session.subscribe(topic, options);
        }
    }
    DisconnectChannel(topic) {
        if (topic != '') {
            const onSuccess = (a) => {
                console.log('Disconnected from channel.', a);
            };
            const onFailure = (a) => {
                console.log('Failure on disconnecting from channel.', a);
            };
            const options = {
                onSuccess: onSuccess,
                onFailure: onFailure
            };
            this.ClientManager.session.unsubscribe(topic, options);
        }
    }
}
//# sourceMappingURL=mqtt.js.map