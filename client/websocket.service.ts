import {Message} from "../shared/message.interface";

class WebsocketService {
    private connection: WebSocket | undefined;

    createConnection() {
        this.connection = new WebSocket('ws://localhost:8080');
    }

    sendMessage(message: Message<any>) {
        this.connection?.send(JSON.stringify(message));
    }

    addMessageHandler(handler: (message: Message<any>) => void) {
        this.connection?.addEventListener('message', ({data}: MessageEvent) => {
            handler(JSON.parse(data));
        })
    }
}

export default WebsocketService;