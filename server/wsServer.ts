import WebSocket, { Server } from 'ws';
import {Message} from '../shared/message.interface';
import {v4 as uuid} from 'uuid';

interface WebSocketWithId extends WebSocket {
  id: string
}

export default class WsServer {
  private ws: Server;
  private connections: WebSocketWithId[];
  constructor() {
    this.connections = [];
    this.ws = new Server({ port: 8080 });
  }

  attachHandlers(
    messageHandler: (data: Message<any>, id: string) => void,
    disconnectHandler: (id: string) => void,
  ): void {
    this.ws.addListener('connection', (socket: WebSocketWithId) => {
      socket.id = uuid();
      this.connections.push(socket);

      socket.addListener('message', (data: string) => {
        messageHandler(JSON.parse(data), socket.id);
      })

      socket.addEventListener('close', () => {
        this.connections = this.connections.filter(connection => connection !== socket);
        disconnectHandler(socket.id);
      })
    })
  }

  sendMessageToPlayer(id: string, message: any) {
    this.connections.find(connection => connection.id === id)?.send(JSON.stringify(message))
  }

  sendMessageToAllPlayers(message: any) {
    this.connections.forEach(client => client.send(JSON.stringify(message)))
  }
}

