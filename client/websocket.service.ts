import {ClientMessageType, Message} from "../shared/message.interface";

class WebsocketService {
    private connection: WebSocket;
    private isConnectionReady = false;
    private messagesQueue: Message[] = [];

    createConnection() {
        this.connection = new WebSocket('ws://localhost:8080');
        this.handleConnectionOpening();
    }

    private handleConnectionOpening() {
        this.connection.addEventListener('open', () => {
            this.isConnectionReady = true;
            this.messagesQueue.forEach(message => this.sendMessage(message))
        })
    }

    sendMessage(message: Message) {
        if (this.isConnectionReady) {
            this.connection?.send(JSON.stringify(message));
        } else {
            this.messagesQueue.push(message)
        }
    }

    addMessageHandler(handler: (message: Message) => void) {
        this.connection?.addEventListener('message', ({data}: MessageEvent) => {
            handler(JSON.parse(data));
        })
    }
}

export default WebsocketService;
