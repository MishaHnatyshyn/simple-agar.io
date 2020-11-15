class Input {
    public startMonitoringInput(canvas: HTMLCanvasElement): void {
        canvas.addEventListener('mousemove', this.onMouseInput.bind(this, canvas));
    }

    public stopMonitoringInput(canvas: HTMLCanvasElement): void {
        canvas.removeEventListener('mousemove', this.onMouseInput.bind(this, canvas));
    }

    private onMouseInput(canvas: HTMLCanvasElement, {clientX, clientY}: MouseEvent): void {
        var rect = canvas.getBoundingClientRect();
        const xCoord = (clientX - rect.left) / (rect.right - rect.left) * canvas.width;
        const yCoord = (clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
        console.log({
            x: (clientX - rect.left) / (rect.right - rect.left) * canvas.width,
            y: (clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
        });
        this.handleInput(xCoord, yCoord);
    }

    private handleInput(xCoord: number, yCoord: number): void {
        const direction = Math.atan2(xCoord - window.innerWidth / 2, window.innerHeight / 2 - yCoord);
        console.log(direction);
    }
}

export default Input;