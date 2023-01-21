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
    public gameMenu: GameMenu;
    public gameHUD: GameHUD;

    public level: Level | undefined;
    public keyboardHandler: KeyboardHandler | undefined;

    private constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        this.gameMenu = new GameMenu(this);
        this.gameHUD = new GameHUD(this);
        this.start();
    }

    public static getInstance(canvas: HTMLCanvasElement): Game {
        if (this.gameInstance) return this.gameInstance;
        const game = new Game(canvas);
        this.gameInstance = game;
        return game;
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
