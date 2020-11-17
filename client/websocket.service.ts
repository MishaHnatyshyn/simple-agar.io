import { Message } from "../shared/message.interface";
import {UpdateMessage} from '../shared/messages.proto';

class WebsocketService {
    private connection: WebSocket;
    private isConnectionReady = false;
    private messagesQueue: Message[] = [];

    createConnection() {
        this.connection = new WebSocket(process.env.WS_URL);
        this.connection.binaryType = "arraybuffer";
        this.handleConnectionOpening();
    }

    private handleConnectionOpening() {
        this.connection.addEventListener('open', () => {
            this.isConnectionReady = true;
            this.messagesQueue.forEach(message => this.sendMessage(message))
        })

        this.connection.addEventListener('close', () => {
            alert('Can not connect to server');
        })
    }

    public sendMessage(message: Message | any) {
        if (this.isConnectionReady) {
            if(message instanceof Uint8Array) {
                this.connection?.send(message);
            } else {
                this.connection?.send(JSON.stringify(message));
            }
        } else {
            this.messagesQueue.push(message)
            alert('The connection with the server is not established. Please try again later');
        }
    }

    public addMessageHandler(handler: (message: Message) => void) {
        this.connection?.addEventListener('message', async (event: MessageEvent) => {
            if (event.data instanceof ArrayBuffer) {
                const res = UpdateMessage.decode(new Uint8Array(event.data)) as any;
                handler((res as unknown) as Message);
            } else handler(JSON.parse(event.data));
        })
    }


}

export default WebsocketService;
