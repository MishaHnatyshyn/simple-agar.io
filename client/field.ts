import Input from "./input";
import WebsocketService from "./websocket.service";

const BALL_RADIUS = 20;

class Field {
    private renderInterval: number;
    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

    constructor(
        private inputService: Input,
        private websocketService: WebsocketService
    ) {}

    public handleField(): void {
        this.websocketService.createConnection();
        this.createCanvas();
        this.startRendering();
        this.inputService.startMonitoringInput(this.canvas);

        setTimeout(this.stopRendering.bind(this), 5000);
    }

    public startRendering(): void {
        this.renderInterval = window.setInterval(this.drawField.bind(this), 1000 / 60);
    }

    public stopRendering(): void {
        clearInterval(this.renderInterval);
    }

    private createCanvas(): void {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.context = this.canvas?.getContext("2d");

        this.canvas.width = 10000;
        this.canvas.height = 10000;
    }

    private drawBackground(): void {
        const background = new Image();
        background.src = "https://www.xmple.com/wallpaper/graph-paper-white-blue-grid-1920x1080-c2-ffffff-4682b4-l2-10-140-a-0-f-20.svg";

        background.onload = () => {
            this.context.fillStyle = this.context.createPattern(background, 'repeat');
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    private drawField(): void {
        this.drawBall({x: 50, y: 70, direction: 2.171186907780511});
    }

    drawBall(player) {
        const { x, y, direction } = player;
        const canvasX = this.canvas.width / 2 + x - player.x;
        const canvasY = this.canvas.height / 2 + y - player.y;

        this.context.save();
        // this.context.translate(canvasX, canvasY);
        // this.context.rotate(direction);
        this.context.beginPath()
        this.context.arc(x, y, BALL_RADIUS, 0, 2 * Math.PI);
        this.context.fillStyle = 'red';
        this.context.fill();
        // this.context.restore();
    }


}

export default Field;

