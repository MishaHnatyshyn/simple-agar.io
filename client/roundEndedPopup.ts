import WebsocketService from "./websocket.service";
import {ClientMessageType} from "../shared/message.interface";

class RoundEndedPopup {
    constructor(
        private websocketService: WebsocketService
    ) {}

    public handleRoundEnded(roundEndedHandler: () => void, startNewGameHandler: () => void, name: string): void {
        document.getElementById('roundEndedPopup').style.display = 'block';
        roundEndedHandler();
        this.startNewRound(name, startNewGameHandler);
    }

    private startNewRound(name: string, startNewGameHandler: () => void): void {
        document.getElementById('startRound').addEventListener('click', () => {
            this.websocketService.sendMessage({type: ClientMessageType.START_GAME, data: { name }});
            startNewGameHandler();

            document.getElementById('roundEndedPopup').style.display = 'none';
        })
    }
}

export default RoundEndedPopup;