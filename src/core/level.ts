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
                public cameraObjectId: string) {

        this.setup();
    }

    get camera(): CameraAnchors {
        const allObjects = [this.hero, ...this.objects];
        const cameraObject = allObjects.find(o => o.id === this.cameraObjectId);
        const top = ((this.game.canvas.height - (cameraObject?.height ?? 0)) / 2) - (cameraObject?.y ?? 0);
        const left = ((this.game.canvas.width - (cameraObject?.width ?? 0)) / 2) - (cameraObject?.x ?? 0);
        return { top, left };
    }

    get solidObjects(): Positionable[] {
        return this.objects.filter(o => o.solid);
    }

    /** setup method is responsible to make objects and other configurations */
    protected abstract setup(): void;

    public update(): void {
        this.game.keyboardHandler?.update();
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
