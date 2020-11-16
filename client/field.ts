import {FIELD_HEIGHT, FIELD_WIDTH} from '../shared/constants';
import {Ball} from "../shared/ball.interface";

class Field {
    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

    public createCanvas(): HTMLCanvasElement {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.context = this.canvas?.getContext("2d");

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        return this.canvas;
    }

    public drawField(data: { currentPlayer: Ball, objects: Ball[] }): void {
        this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);

        const currentPlayer = data.currentPlayer;
        this.drawBackground(currentPlayer.x, currentPlayer.y);
        data.objects.forEach((ball: Ball) => {
            this.drawBall(currentPlayer, ball);
        })
        this.drawBall(currentPlayer, currentPlayer);
        this.drawBorder(currentPlayer);
    }

    private drawBorder(currentPlayer: Ball): void {
        this.context.beginPath();
        this.context.strokeStyle = 'black';
        this.context.lineWidth = 5;
        this.context.strokeRect(
            this.canvas.width / 2 - currentPlayer.x,
            this.canvas.height / 2 - currentPlayer.y,
            FIELD_WIDTH,
            FIELD_HEIGHT
        );
    }

    private drawBackground(x, y): void {
        [...new Array(100)].forEach((_, index) => {
            const start = { x: index * FIELD_WIDTH / 100 - x + this.canvas.width / 2, y: 0  - y + this.canvas.height / 2}
            const end = { x: index * FIELD_WIDTH / 100 - x + this.canvas.width / 2, y: FIELD_HEIGHT - y + this.canvas.height / 2 }

            this.drawBackgroundNetLine(start, end);
        });
        [...new Array(80)].forEach((_, index) => {
            const start = { x: 0 - x + this.canvas.width / 2, y: index * FIELD_HEIGHT / 80  - y + this.canvas.height / 2}
            const end = { x: FIELD_WIDTH - x + this.canvas.width / 2, y: index * FIELD_HEIGHT / 80 - y + this.canvas.height / 2 }

            this.drawBackgroundNetLine(start, end);
        })
    }

    private drawBackgroundNetLine(start, end): void {
        this.context.beginPath()
        this.context.moveTo(start.x, start.y)
        this.context.lineTo(end.x, end.y);
        this.context.strokeStyle = '#a3e3b4';
        this.context.lineWidth = 1;
        this.context.stroke();
    }

    private drawBall(currentPlayerBall: Ball, ball: Ball) {
        const canvasX = this.canvas.width / 2 + ball.x - currentPlayerBall.x;
        const canvasY = this.canvas.height / 2 + ball.y - currentPlayerBall.y;

        this.context.save();
        this.context.translate(0, 0);
        this.context.beginPath()
        this.context.arc(canvasX, canvasY, ball.radius, 0, 2 * Math.PI);
        if(ball.name) {
            this.context.strokeStyle = 'black';
            this.context.lineWidth = 4;
            this.context.stroke();

            this.context.textAlign = 'center';
            this.context.textBaseline = 'middle';
            this.context.font = "bold 18px Arial";

            this.context.fillText(ball.name, canvasX, canvasY - ball.radius - 10)
        }
        this.context.fillStyle = ball.color;
        this.context.fill();
        this.context.restore();
    }

}

export default Field;

