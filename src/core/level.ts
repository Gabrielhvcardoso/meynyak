import { Game } from "./game";
import { Hero } from "./entities/hero";
import { Positionable } from "./entities/positionable";
import { PositionableLimits } from "./types/positionable-limits";
import { Luminous } from "./entities/luminous";
import { LevelDrawer } from "./level-drawer";
import { LevelClock } from "./level-clock";

export type CameraAnchors = Pick<PositionableLimits, 'top'|'left'>

export abstract class Level {
    levelClock: LevelClock;
    levelDrawer: LevelDrawer;

    constructor(public game: Game,
                public objects: Positionable[],
                public hero: Hero,
                public cameraObjectId: string) {

        this.setup();
        this.levelClock = new LevelClock();
        this.levelDrawer = new LevelDrawer(this.game);
    }

    /** setup method is responsible to make objects and other configurations */
    protected abstract setup(): void;

    public update(): void {
        this.game.keyboardHandler?.update();
        this.hero.update();

        for (let object of this.objects) {
            object.update();
        }

        this.levelClock.update();
        this.levelDrawer.update();
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

    get luminousObjects(): Luminous[] {
        return this.allObjects.filter(o => 'luminous' in o && o.luminous === true) as Luminous[];
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
}
