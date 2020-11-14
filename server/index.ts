import WsServer from './wsServer';
import Game from './game';
import {ClientMessageType, Message} from '../shared/message.interface';
import Player from '../shared/player';

const server = new WsServer();
const game = new Game();

server.attachHandlers(
  (message: Message<any>, id: string) => {
    switch (message.type) {
      case ClientMessageType.START_GAME:
        const player = new Player(message.data.name, id);
        game.addPlayer(player);
        break;
      case ClientMessageType.CHANGE_POSITION:
        game.updatePlayerPosition(id, message.data.x, message.data.y);
        break;
    }
  },
  (id: string) => {
    game.removePlayer(id);
  });
