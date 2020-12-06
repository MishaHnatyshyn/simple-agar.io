import WebsocketService from "./websocket.service";
import {ClientMessageType} from "../shared/message.interface";
import {TopPlayer} from "../shared/topPlayers.interface";

class RoundEndedPopup {
    private roundEndedPopup: HTMLElement;
    private startRoundButton: HTMLElement;
    private playersLeaderBoard: HTMLElement;
    private isOnRoundEndedPage = false;

    constructor(
        private websocketService: WebsocketService
    ) {
        this.roundEndedPopup = document.getElementById('roundEndedPopup');
        this.startRoundButton = document.getElementById('startRound');
        this.playersLeaderBoard = document.getElementById('playersBoard');
    }

    public handleRoundEnded(roundEndedHandler: () => void, startNewGameHandler: () => void, name: string, topPlayers: TopPlayer[]): void {
        if(this.isOnRoundEndedPage) {
            return;
        }
        this.roundEndedPopup.style.display = 'flex';
        roundEndedHandler();
        this.drawLeaderBoard(topPlayers);
        this.startNewRound(name, startNewGameHandler);
        this.isOnRoundEndedPage = true;
    }

    private startNewRound(name: string, startNewGameHandler: () => void): void {
        this.startRoundButton.addEventListener('click', () => {
            this.websocketService.sendMessage({type: ClientMessageType.START_GAME, data: { name }});
            startNewGameHandler();
            this.isOnRoundEndedPage = false;

            this.roundEndedPopup.style.display = 'none';
        })
    }

    private drawLeaderBoard(topPlayers: TopPlayer[]): void {
        let result = '';
        topPlayers.forEach((leader: TopPlayer, index: number) => {
            result += `<div class="boardPlayer"><span>${index + 1}. ${leader.name}</span><span>${Math.round(leader.radius)}</span></div>`
        })

        this.playersLeaderBoard.innerHTML = result;
    }
}

export default RoundEndedPopup;