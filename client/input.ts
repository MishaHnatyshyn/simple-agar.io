import WebsocketService from "./websocket.service";
import {ClientMessageType} from "../shared/message.interface";

class Input {
    private mouseInputHandler;
    constructor(
        private websocketService: WebsocketService
    ) {}

    public startMonitoringInput(canvas: HTMLCanvasElement): void {
        this.mouseInputHandler = this.onMouseInput.bind(this, canvas)
        canvas.addEventListener('mousemove', this.mouseInputHandler);
    }

    public stopMonitoringInput(canvas: HTMLCanvasElement): void {
        canvas.removeEventListener('mousemove', this.mouseInputHandler);
    }

    private onMouseInput(canvas: HTMLCanvasElement, {clientX, clientY}: MouseEvent): void {
        const rect = canvas.getBoundingClientRect();
        const xCoord = (clientX - rect.left) / (rect.right - rect.left) * canvas.width;
        const yCoord = (clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
        this.handleInput(xCoord, yCoord);
    }

    private handleInput(xCoord: number, yCoord: number): void {
        const direction = Math.atan2(xCoord - window.innerWidth / 2, window.innerHeight / 2 - yCoord);

        this.websocketService.sendMessage({type: ClientMessageType.CHANGE_DIRECTION, data: {direction}})
    }
}

export default Input;
