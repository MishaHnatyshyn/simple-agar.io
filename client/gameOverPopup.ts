import {ClientMessageType} from "../shared/message.interface";
import WebsocketService from "./websocket.service";

class GameOverPopup {
    private gameOverPopup: HTMLElement;
    private startNewGameButton: HTMLElement;

    constructor(
        private websocketService: WebsocketService
    ) {
        this.gameOverPopup = document.getElementById('gameOverPopup');
        this.startNewGameButton = document.getElementById('startNewGame');
    }

    public handleGameOver(gameOverHandler: () => void, startNewGameHandler: () => void, name: string): void {
        this.gameOverPopup.style.display = 'flex';
        gameOverHandler();
        this.startNewGame(name, startNewGameHandler);
    }

    private startNewGame(name: string, startNewGameHandler: () => void): void {
        this.startNewGameButton.addEventListener('click', () => {
            this.websocketService.sendMessage({type: ClientMessageType.START_GAME, data: { name }});
            startNewGameHandler();

            this.gameOverPopup.style.display = 'none';
        })
    }
}

export default GameOverPopup;