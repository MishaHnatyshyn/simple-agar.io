import WebsocketService from "./websocket.service";
import Input from "./input";
import Field from "./field";
import {ServerMessageType} from "../shared/message.interface";
import StartGamePopup from "./startGamePopup";
import GameOverPopup from "./gameOverPopup";
import RoundEndedPopup from "./roundEndedPopup";

class Game {
    private canvas: HTMLCanvasElement;

    constructor(
        private websocketService: WebsocketService,
        private inputService: Input,
        private fieldService: Field,
        private startGamePopup: StartGamePopup,
        private gameOverPopup: GameOverPopup,
        private roundEndedPopup: RoundEndedPopup
    ) {
    }

    public startGame(): void {
        this.websocketService.createConnection();
        this.canvas = this.fieldService.createCanvas();
        this.startGamePopup.handleGameStart(this.handleStartGame.bind(this));
    }

    public handleStartGame(): void {
        this.handleServerUpdates();
        this.startMonitoringInput();
    }

    public startMonitoringInput() {
        this.inputService.startMonitoringInput(this.canvas);
    }

    public endGame(): void {
        this.fieldService.stopRendering();
        this.inputService.stopMonitoringInput(this.canvas);
    }

    public handleServerUpdates(): void {
        this.websocketService.addMessageHandler((message => {
            switch (message.type) {
                case ServerMessageType.UPDATE_FIELD:
                    this.fieldService.drawField(message.data);
                    break;
                case ServerMessageType.GAME_OVER:
                    this.gameOverPopup.handleGameOver(
                        this.endGame.bind(this),
                        this.startMonitoringInput.bind(this),
                        this.startGamePopup.getUsername()
                    )
                    break;
                case ServerMessageType.FINISH_ROUND:
                    this.roundEndedPopup.handleRoundEnded(
                        this.endGame.bind(this),
                        this.startMonitoringInput.bind(this),
                        this.startGamePopup.getUsername()
                    )
                    break;
            }
        }))
    }
}

export default Game;
