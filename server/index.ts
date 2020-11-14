import WsServer from './wsServer';
import Game from './game';
import Field from './field';

const server = new WsServer();
server.startListening();

const field = new Field();
const game = new Game(field, server);

game.start();


