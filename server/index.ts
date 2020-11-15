import WsServer from './wsServer';
import Game from './game';
import Field from './field';
import FoodGenerator from './foodGenerator';

const server = new WsServer();
server.startListening();

const field = new Field();
const foodGenerator = new FoodGenerator(field, 500, 500);
const game = new Game(field, server, foodGenerator);

game.start();


