import './main.scss'
import Field from "./field";
import WebsocketService from "./websocket.service";
import Input from "./input";
import Game from "./game";
import StartGamePopup from "./startGamePopup";
import GameOverPopup from "./gameOverPopup";
import RoundEndedPopup from "./roundEndedPopup";

export const websocketService = new WebsocketService();
export const inputService = new Input(websocketService);
export const field = new Field();
export const startGamePopup = new StartGamePopup(websocketService);
export const gameOverPopup = new GameOverPopup(websocketService);
export const roundEndedPopup = new RoundEndedPopup(websocketService);
export const game = new Game(
    websocketService,
    inputService,
    field,
    startGamePopup,
    gameOverPopup,
    roundEndedPopup
);

document.addEventListener('DOMContentLoaded', game.startGame.bind(game));