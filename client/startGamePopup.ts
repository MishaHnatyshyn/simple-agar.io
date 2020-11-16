import {ClientMessageType} from "../shared/message.interface";
import WebsocketService from "./websocket.service";

class StartGamePopup {
    private name: string;

    constructor(
       private websocketService: WebsocketService
    ) {}

    public handleGameStart(handler: () => void) {
        const button = document.getElementById("start");

        button.addEventListener('click', () => {
            this.name = (document.getElementById('username') as HTMLInputElement).value;

            if (this.isUsernameValid(this.name)) {
                document.getElementById('notValidUsername').style.display = 'hidden';
                this.websocketService.sendMessage({type: ClientMessageType.START_GAME, data: { name: this.name }});
                handler();
                document.getElementById("startGamePopup").style.display = 'none';
            } else  {
                document.getElementById('notValidUsername').style.visibility = 'visible';
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