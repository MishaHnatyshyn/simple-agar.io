import WebsocketService from "./websocket.service";
import Input from "./input";
import Field from "./field";
import {ClientMessageType, ServerMessageType} from "../shared/message.interface";

class Game {
    private canvas: HTMLCanvasElement;
    private name = "Vlada";

    constructor(
        private websocketService: WebsocketService,
        private inputService: Input,
        private fieldService: Field
    ) {
    }

    public startGame(): void {
        this.websocketService.createConnection();
        this.canvas = this.fieldService.createCanvas();
        this.websocketService.sendMessage({type: ClientMessageType.START_GAME, data: { name: this.name }})
        this.handleServerUpdates();
        this.inputService.startMonitoringInput(this.canvas);
    }

    public endGame(): void {
        this.fieldService.stopRendering();
        this.inputService.stopMonitoringInput(this.canvas);
    }

    public handleServerUpdates(): void {
        this.websocketService.addMessageHandler((message => {
            switch (message.type) {
                case ServerMessageType.UPDATE_ENEMIES_POSITIONS:
                    this.fieldService.drawField(message.data, this.name);
                    break;
                case ServerMessageType.GAME_OVER:
                    this.endGame();
                    break;
                case ServerMessageType.FINISH_ROUND:
                    this.endGame();
                    break;
            }
        }))
    }
}

export default Game;