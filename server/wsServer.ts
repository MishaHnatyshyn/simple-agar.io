import WebSocket, {Server} from 'ws';
import {ClientMessage, ServerMessage, ServerMessageType} from '../shared/message.interface';
import {v4 as uuid} from 'uuid';
import {NetworkChannel} from './networkChannel.interface';
import {UpdateMessage} from '../shared/messages.proto';

interface WebSocketWithId extends WebSocket{
  id: string
}

export default class WsServer extends NetworkChannel {
  private readonly port = Number(process.env.PORT) || 8080;
  private ws: Server;
  private connections: WebSocketWithId[];
  constructor() {
    super();
    this.connections = [];
    this.ws = new Server({ port: this.port });
  }

  public startListening(): void {
    this.ws.addListener('connection', (socket: WebSocketWithId) => {
      socket.id = uuid();
      this.connections.push(socket);
      this.connectionHandlers.forEach(handler => handler(socket.id));
      socket.addListener('message', (data: string) => {
        const parsedData: ClientMessage = JSON.parse(data);
        this.messageHandlers.forEach(handler => handler(parsedData, socket.id));
      })

      socket.addEventListener('close', () => {
        this.connections = this.connections.filter(connection => connection !== socket);
        this.disconnectHandlers.forEach(handler => handler(socket.id));
      })
    })
  }

  public sendMessageToPlayer(id: string, message: ServerMessage) {
    if (message.type === ServerMessageType.UPDATE_FIELD) {
      const encoded = UpdateMessage.encode(message).finish();
      this.connections.find(connection => connection.id === id)?.send(encoded);
      return;
    }
    this.connections.find(connection => connection.id === id)?.send(JSON.stringify(message))
  }

  public sendMessageToAllPlayers(message: ServerMessage) {
    this.connections.forEach(client => client.send(JSON.stringify(message)))
  }
}

