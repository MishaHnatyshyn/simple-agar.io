import {ClientMessageType} from "../shared/message.interface";
import WebsocketService from "./websocket.service";

class GameOverPopup {
    constructor(
        private websocketService: WebsocketService
    ) {}

    public handleGameOver(gameOverHandler: () => void, startNewGameHandler: () => void, name: string): void {
        document.getElementById('gameOverPopup').style.display = 'block';
        gameOverHandler();
        this.startNewGame(name, startNewGameHandler);
    }

    private startNewGame(name: string, startNewGameHandler: () => void): void {
        document.getElementById('startNewGame').addEventListener('click', () => {
            this.websocketService.sendMessage({type: ClientMessageType.START_GAME, data: { name }});
            startNewGameHandler();

            document.getElementById('gameOverPopup').style.display = 'none';
        })
    }
}

export default GameOverPopup;