import {ClientMessageType} from "../shared/message.interface";
import WebsocketService from "./websocket.service";

class StartGamePopup {
    private name: string;
    private startGameButton: HTMLElement;
    private usernameInput: HTMLElement;
    private notValidUsernameError: HTMLElement;
    private startGamePopup: HTMLElement;

    constructor(
       private websocketService: WebsocketService
    ) {
        this.startGameButton = document.getElementById("start");
        this.usernameInput = document.getElementById('username');
        this.notValidUsernameError = document.getElementById('notValidUsername');
        this.startGamePopup = document.getElementById("startGamePopup");
    }

    public handleGameStart(handler: () => void) {
        this.startGameButton.addEventListener('click', () => {
            this.name = (this.usernameInput as HTMLInputElement).value;

            if (this.isUsernameValid(this.name)) {
                this.notValidUsernameError.style.display = 'hidden';
                this.websocketService.sendMessage({type: ClientMessageType.START_GAME, data: { name: this.name }});
                handler();
                this.startGamePopup.style.display = 'none';
            } else  {
                this.notValidUsernameError.style.visibility = 'visible';
            }
        })
    }

    public getUsername(): string {
        return this.name;
    }

    private isUsernameValid(name: string): boolean {
        return !!name.length;
    }
}

export default StartGamePopup;