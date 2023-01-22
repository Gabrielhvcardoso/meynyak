import { Game } from "./game";
import { Hero } from "./entities/hero";
import { Positionable } from "./entities/positionable";
import { PositionableLimits } from "./types/positionable-limits";

export type CameraAnchors = Pick<PositionableLimits, 'top'|'left'>

export abstract class Level {
    constructor(protected game: Game,
                public objects: Positionable[],
                public hero: Hero,
                public cameraObjectId: string) {
        this.setup();
    }

    /** setup method is responsible to make objects and other configurations */
    protected abstract setup(): void;

    public update(): void {
        this.updateTime();

        this.game.keyboardHandler?.update();
        this.hero.update();

        for (let object of this.objects) {
            object.update();
        }
    }

    // Clock management

    readonly dayMinuteSteps = 1000 / (1000/Game.gameFPS);
    dayMinuteStep = 0;
    dayMinutes = 0;

    get hour(): number {
        return Math.floor(this.dayMinutes / 60);
    }

    get hourMinutes(): number {
        return this.dayMinutes - (this.hour * 60);
    }

    private updateTime(): void {
        this.dayMinuteStep += 1;

        if (this.dayMinuteStep === this.dayMinuteSteps) {
            this.dayMinuteStep = 0;
            this.dayMinutes += 1;
        }

        if (this.dayMinutes === 1440) {
            this.dayMinutes = 0;
        }
    }

    // Map

    get cameraObject(): Positionable | undefined {
        const allObjects = [this.hero, ...this.objects];
        const cameraObject = allObjects.find(o => o.id === this.cameraObjectId);
        return cameraObject;
    }

    get camera(): CameraAnchors {
        const { x, y, areaWidth: w, areaHeight: h } = this.cameraObject ?? { x: 0, y: 0, areaWidth: 0, areaHeight: 0 };
        const top = ((this.game.canvas.height - h) / 2) - y;
        const left = ((this.game.canvas.width - w) / 2) - x;
        return { top, left };
    }

    get mapLimits(): PositionableLimits {
        const { x, y, areaWidth: w, areaHeight: h } = this.cameraObject ?? { x: 0, y: 0, areaWidth: 0, areaHeight: 0 };
        const left = x - (this.game.canvas.width - w) / 2;
        const top = y - (this.game.canvas.height - h) / 2;
        const right = left + this.game.canvas.width;
        const bottom = top + this.game.canvas.height;

        return ({ top, right, bottom, left });
    }

    get allObjects(): Positionable[] {
        return [this.hero, ...this.objects];
    }

    get solidObjects(): Positionable[] {
        return this.objects.filter(o => o.solid);
    }

    get visibleObjects(): Positionable[] {
        const { top, right, bottom, left } = this.mapLimits;

        return this.allObjects.filter(o => {
            return (o.frameLimits.top > top && o.frameLimits.top < bottom)
                || (o.frameLimits.bottom > top && o.frameLimits.bottom < bottom)
                || (o.frameLimits.top < top && o.frameLimits.bottom > bottom)

                || (o.frameLimits.left > left && o.frameLimits.left < right)
                || (o.frameLimits.right > left && o.frameLimits.right < right)
                || (o.frameLimits.left < left && o.frameLimits.right > right);
        });
    }

    public draw(): void {
        this.game.ctx.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        const yOrderedObjects = this.visibleObjects.sort((a, b) => a.y - b.y);

        for (let object of yOrderedObjects) {
            object.draw();
        }
    }
}
