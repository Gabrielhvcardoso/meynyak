export class Game {
    private static gameInstance: Game;

    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;

    private constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        this.init();
    }

    public static getInstance(canvas: HTMLCanvasElement): Game {
        if (this.gameInstance) return this.gameInstance;
        const game = new Game(canvas);
        this.gameInstance = game;
        return game;
    }

    //

    private init(): void {
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(0, 0, 100, 100);
    }
}
