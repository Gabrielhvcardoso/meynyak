import { GameMenu } from "./game-menu";
import { KeyboardHandler } from "./keyboard-handler";
import { Level } from "./level";

export class Game {
    private static gameInstance: Game;
    private static gameInterval: NodeJS.Timer;
    static gameFPS = 10;

    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;

    public shadowCanvas: HTMLCanvasElement;
    public shadowCtx: CanvasRenderingContext2D;
    
    
    public menu: GameMenu;
    public level: Level | undefined;
    public keyboardHandler: KeyboardHandler | undefined;

    public startTime: number;

    get deltaTime(): number {
        return (performance.now() - this.startTime) / 1000 ;
    }

    private constructor(canvas: HTMLCanvasElement, shadowCanvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        this.shadowCanvas = shadowCanvas;
        this.shadowCtx = shadowCanvas.getContext("2d") as CanvasRenderingContext2D;
        this.menu = new GameMenu(this);
        this.startTime = performance.now();
        this.start();
    }

    public static getInstance(canvas: HTMLCanvasElement, shadowCanvas: HTMLCanvasElement): Game {
        if (this.gameInstance) return this.gameInstance;
        this.gameInstance = new Game(canvas, shadowCanvas);
        return this.gameInstance;
    }

    //

    private start(): void {
        if (Game.gameInterval) clearInterval(Game.gameInterval);

        Game.gameInterval = setInterval(() => {
            if (!this.level) {
                this.menu.update();
                this.menu.draw();
                return;
            }

            this.level.update();

        }, 1000 / Game.gameFPS);
    }
}
