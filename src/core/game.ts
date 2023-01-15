import { GameMenu } from "./game-menu";
import { KeyboardHandler } from "./keyboard-handler";
import { Level } from "./level";

export class Game {
    private static gameInstance: Game;

    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public gameMenu: GameMenu;

    public level: Level | undefined;
    public keyboardHandler: KeyboardHandler | undefined;

    private constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        this.gameMenu = new GameMenu(this);
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
        const step = () => {
            if (this.level) {
                
            } else {
                this.gameMenu.draw();
            }

            requestAnimationFrame(() => {
                step();
            });
        }

        step();
    }
}
