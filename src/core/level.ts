import { GameObject } from "./entities/game-object";
import { Game } from "./game";

export interface LevelConfig {}

export abstract class Level {
    public objects: GameObject[] = [];

    constructor(protected game: Game) {
        this.setup();
    }

    /** setup method is responsible to make objects and other configurations */
    protected abstract setup(): void;
}
