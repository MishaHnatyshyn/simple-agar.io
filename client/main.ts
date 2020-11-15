import './main.scss'
import Field from "./field";
import WebsocketService from "./websocket.service";
import Input from "./input";
import Game from "./game";


export const websocketService = new WebsocketService();
export const inputService = new Input(websocketService);
export const field = new Field();
export const game = new Game(websocketService, inputService, field);


document.addEventListener('DOMContentLoaded', game.startGame.bind(game));