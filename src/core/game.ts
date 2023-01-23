import { GameHUD } from "./game-hud";
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
    
    public gameMenu: GameMenu;
    public gameHUD: GameHUD;

    public level: Level | undefined;
    public keyboardHandler: KeyboardHandler | undefined;

    private constructor(canvas: HTMLCanvasElement, shadowCanvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        this.shadowCanvas = shadowCanvas;
        this.shadowCtx = shadowCanvas.getContext("2d") as CanvasRenderingContext2D;
        this.gameMenu = new GameMenu(this);
        this.gameHUD = new GameHUD(this);
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
                this.gameMenu.update();
                this.gameMenu.draw();
                return;
            }

            this.level.update();
            this.level.draw();
            this.gameHUD.draw();
        }, 1000 / Game.gameFPS);
    }
}
