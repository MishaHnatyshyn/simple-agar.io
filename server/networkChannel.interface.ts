import {ClientMessage, ServerMessage} from '../shared/message.interface';

export interface NewMessageHandler {
  (message: ClientMessage, id: string): void
}

export interface DisconnectHandler {
  (id: string): void
}

export interface ConnectHandler {
  (id: string): void
}

export interface INetworkChannel {
  sendMessageToPlayer: (id: string, message: ServerMessage) => void,
  sendMessageToAllPlayers: (message: ServerMessage) => void,
  attachMessageHandler: (handler: NewMessageHandler) => void,
  attachDisconnectHandler: (handler: DisconnectHandler) => void,
  attachConnectHandler: (handler: ConnectHandler) => void
}

export abstract class NetworkChannel implements INetworkChannel {
  protected connectionHandlers: ConnectHandler[] = [];
  protected disconnectHandlers: DisconnectHandler[] = [];
  protected messageHandlers: NewMessageHandler[] = [];

  attachConnectHandler(handler: ConnectHandler): void {
    this.connectionHandlers.push(handler);
  }

  attachDisconnectHandler(handler: DisconnectHandler): void {
    this.disconnectHandlers.push(handler);
  }

  attachMessageHandler(handler: NewMessageHandler): void {
    this.messageHandlers.push(handler)
  }

  abstract sendMessageToPlayer(id: string, message: ServerMessage): void

  abstract sendMessageToAllPlayers(message: ServerMessage): void
}
