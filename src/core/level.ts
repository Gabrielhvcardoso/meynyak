import { Hero } from "./entities/hero";
import { Positionable } from "./entities/positionable";
import { Game } from "./game";

export interface LevelConfig {}

export interface CameraAnchors {
    top: number;
    left: number;
}

export abstract class Level {
    constructor(protected game: Game,
                public objects: Positionable[],
                public hero: Hero,
                public _camera: Positionable) {

        this.setup();
    }

    get camera(): CameraAnchors {
        const top = (this.game.canvas.height - this._camera.height) / 2;
        const left = (this.game.canvas.width - this._camera.width) / 2;
        return { top, left };
    }

    /** setup method is responsible to make objects and other configurations */
    protected abstract setup(): void;

    public update(): void {
        this.hero.update();
        for (let object of this.objects) {
            object.update();
        }
    }

    public draw(): void {
        this.game.ctx.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);

        const allObjects = [this.hero, ...this.objects];
        const yOrderedObjects = allObjects.sort((a, b) => a.y - b.y);

        for (let object of yOrderedObjects) {
            object.draw();
        }
    }
}
