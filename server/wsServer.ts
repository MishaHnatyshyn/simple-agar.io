import WebSocket, { Server, Data } from 'ws';

export default class WsServer {
  private ws: Server;
  private connections: WebSocket[];
  constructor() {
    this.connections = [];
    this.ws = new Server({ port: 8080 });
  }

  addConnectionHandler(connectionHandler: (socket: WebSocket) => void, messageHandler: (data: Data) => void): void {
    this.ws.addListener('connection', (socket: WebSocket) => {
      connectionHandler(socket);
      socket.addEventListener('message', (data: Data) => {
        messageHandler(data);
      })
    })
  }

  getConnections(): Set<WebSocket> {
    return this.ws.clients
  }
}

