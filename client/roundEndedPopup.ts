import WebsocketService from "./websocket.service";
import {ClientMessageType} from "../shared/message.interface";

class RoundEndedPopup {
    private roundEndedPopup: HTMLElement;
    private startRoundButton: HTMLElement;

    constructor(
        private websocketService: WebsocketService
    ) {
        this.roundEndedPopup = document.getElementById('roundEndedPopup');
        this.startRoundButton = document.getElementById('startRound');
    }

    public handleRoundEnded(roundEndedHandler: () => void, startNewGameHandler: () => void, name: string): void {
        this.roundEndedPopup.style.display = 'flex';
        roundEndedHandler();
        this.startNewRound(name, startNewGameHandler);
    }

    private startNewRound(name: string, startNewGameHandler: () => void): void {
        this.startRoundButton.addEventListener('click', () => {
            this.websocketService.sendMessage({type: ClientMessageType.START_GAME, data: { name }});
            startNewGameHandler();

            this.roundEndedPopup.style.display = 'none';
        })
    }
}

export default RoundEndedPopup;