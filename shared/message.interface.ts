export enum ClientMessageType {
  CHANGE_DIRECTION,
  START_GAME,
}

export enum ServerMessageType {
  UPDATE_FIELD,
  FINISH_ROUND,
  START_NEW_ROUND,
  GAME_OVER,
  NEW_FOOD,
  PLAYER_VALIDATION,
}

export interface BaseMessage<T, D = any> {
  type: T,
  data: D
}

export type ClientMessage<D = any> = BaseMessage<ClientMessageType, D>
export type ServerMessage<D = any> = BaseMessage<ServerMessageType, D>

export type Message<D = any> = ClientMessage<D> | ServerMessage<D>

