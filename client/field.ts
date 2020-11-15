import Player from "../shared/player";

const BALL_RADIUS = 20;

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

        this.canvas.width = 10000;
        this.canvas.height = 10000;

        return this.canvas;
    }

    public drawField(data: any[], name: string): void {
        console.log(Object.values(data).find((player: any) => player.name === name));
        const currentPlayer = Object.values(data).find((player: any) => player.name === name);
        console.log(currentPlayer);
        this.drawBall(currentPlayer);
    }

    private drawBackground(): void {
        const background = new Image();
        background.src = "https://www.xmple.com/wallpaper/graph-paper-white-blue-grid-1920x1080-c2-ffffff-4682b4-l2-10-140-a-0-f-20.svg";

        background.onload = () => {
            this.context.fillStyle = this.context.createPattern(background, 'repeat');
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    private drawBall(player: any) {
        console.log(player);
        const { _position, _radius, _color } = player;
        const canvasX = this.canvas.width / 2 + _position.x - _position.x;
        const canvasY = this.canvas.height / 2 + _position.y - _position.y;

        this.context.save();
        // this.context.translate(canvasX, canvasY);
        // this.context.rotate(1.05);
        this.context.beginPath()
        this.context.arc(_position.x, _position.y, _radius, 0, 2 * Math.PI);
        this.context.fillStyle = _color;
        this.context.fill();
        this.context.restore();
    }


}

export default Field;

