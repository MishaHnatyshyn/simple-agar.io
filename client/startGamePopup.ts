import {ClientMessageType, ServerMessageType} from "../shared/message.interface";
import WebsocketService from "./websocket.service";
import {PlayerValidation} from "../shared/playerValidation";

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

    public handleGameStart() {
        this.startGameButton.addEventListener('click', () => {
            this.name = (this.usernameInput as HTMLInputElement).value;
            this.notValidUsernameError.style.display = 'hidden';
            this.websocketService.sendMessage({type: ClientMessageType.START_GAME, data: { name: this.name }});
        })
    }

    public handlePlayerValidation(validation, handler: () => void) {
        if(validation === PlayerValidation.valid) {
            handler();
            this.startGamePopup.style.display = 'none';
        } else {
            this.notValidUsernameError.style.visibility = 'visible';
        }
    }

    public getUsername(): string {
        return this.name;
    }
}

export default StartGamePopup;