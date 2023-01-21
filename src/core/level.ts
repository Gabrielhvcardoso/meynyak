import { Hero } from "./entities/hero";
import { Positionable } from "./entities/positionable";
import { Game } from "./game";

export interface LevelConfig {}

export interface CameraAnchors {
    top: number;
    left: number;
}

export abstract class Level {

    readonly dayMinuteSteps = 1000 / (1000/Game.gameFPS);
    dayMinuteStep = 0;
    dayMinutes = 0;

    get hour(): number {
        return Math.floor(this.dayMinutes / 60);
    }

    get hourMinutes(): number {
        return this.dayMinutes - (this.hour * 60);
    }

    constructor(protected game: Game,
                public objects: Positionable[],
                public hero: Hero,
                public cameraObjectId: string) {

        this.setup();
    }

    get camera(): CameraAnchors {
        const allObjects = [this.hero, ...this.objects];
        const cameraObject = allObjects.find(o => o.id === this.cameraObjectId);
        const top = ((this.game.canvas.height - (cameraObject?.areaHeight ?? 0)) / 2) - (cameraObject?.y ?? 0);
        const left = ((this.game.canvas.width - (cameraObject?.areaWidth ?? 0)) / 2) - (cameraObject?.x ?? 0);
        return { top, left };
    }

    get solidObjects(): Positionable[] {
        return this.objects.filter(o => o.solid);
    }

    /** setup method is responsible to make objects and other configurations */
    protected abstract setup(): void;

    private updateTime(): void {
        this.dayMinuteStep += 1;

        if (this.dayMinuteStep === this.dayMinuteSteps) {
            this.dayMinuteStep = 0;
            this.dayMinutes += 5;
        }

        if (this.dayMinutes === 1440) {
            this.dayMinutes = 0;
        }
    }

    public update(): void {
        this.updateTime();

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
