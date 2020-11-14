export enum ClientMessageType {
  CHANGE_POSITION = 'change_position',
  START_GAME = 'start_game',
}

export enum ServerMessageType {
  UPDATE_ENEMIES_POSITIONS = 'update_enemies_position',
  FINISH_ROUND = 'finish_round',
  START_NEW_ROUND = 'start_new_round',
  GAME_OVER = 'game_over',
}

export interface Message<T> {
  type: ServerMessageType | ClientMessageType,
  data: T
}
