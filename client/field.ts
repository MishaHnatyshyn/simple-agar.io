import {FIELD_HEIGHT, FIELD_WIDTH} from '../shared/constants';
import Player from "../shared/player";

class Field {
    private renderInterval: number;
    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

    public stopRendering(): void {
        clearInterval(this.renderInterval);
    }

    public createCanvas(): HTMLCanvasElement {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.context = this.canvas?.getContext("2d");

        this.canvas.width = FIELD_WIDTH;
        this.canvas.height = FIELD_HEIGHT;

        return this.canvas;
    }

    public drawField(data: any): void {
        this.context.clearRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);

        const currentPlayer = data.currentPlayer;
        // this.drawBackground();
        data.food.forEach((ball: Player) => {
            this.drawBall(currentPlayer, ball);
        })

        data.enemies.forEach((enemy: Player) => {
            this.drawBall(currentPlayer, enemy);
        })
        this.drawBall(currentPlayer, currentPlayer);


    }

    private drawBackground(): void {
        const background = new Image();
        background.src = "https://www.xmple.com/wallpaper/graph-paper-white-blue-grid-1920x1080-c2-ffffff-4682b4-l2-10-140-a-0-f-20.svg";

        background.onload = () => {
            this.context.fillStyle = this.context.createPattern(background, 'repeat');
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    private drawBall(currentPlayerBall: Player, ball: Player) {
        console.log(window.innerHeight, window.innerWidth);
        const canvasX = window.innerWidth / 2 + ball.position.x - currentPlayerBall.position.x;
        const canvasY = window.innerHeight / 2 + ball.position.y - currentPlayerBall.position.y;

        this.context.save();
        this.context.translate(canvasX, canvasY);
        // this.context.rotate(1.05);
        this.context.beginPath()
        this.context.arc(ball.position.x, ball.position.y, ball.radius, 0, 2 * Math.PI);
        this.context.fillStyle = ball.color;
        this.context.fill();
        this.context.restore();
    }

}

export default Field;

