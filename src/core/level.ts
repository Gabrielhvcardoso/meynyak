import { GameObject } from "./entities/game-object";
import { Positionable } from "./entities/positionable";
import { Game } from "./game";

export interface LevelConfig {}

export abstract class Level {
    public objects: GameObject[] = [];

    constructor(protected game: Game) {
        this.setup();
    }

    /** setup method is responsible to make objects and other configurations */
    protected abstract setup(): void;

    public update(): void {
        for (let object of this.objects) {
            object.update();
        }
    }

    public draw(): void {
        this.game.ctx.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);

        for (let object of this.objects) {
            if (object instanceof Positionable) {
                object.draw();
            }
        }
    }
}
