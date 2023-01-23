import { Game } from "./game";
import { Hero } from "./entities/hero";
import { Positionable } from "./entities/positionable";
import { PositionableLimits } from "./types/positionable-limits";
import { Luminous } from "./entities/luminous";
import daylightAlphaHoursBreakpoints from './data/daylight-alpha-hours-breakpoints.json';

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

    dayMinutes = 0;
    dayMinuteStep = 0;
    readonly dayMinuteSteps = 1000 / (1000/Game.gameFPS);
    readonly daylightAlphaHoursBreakpoints = daylightAlphaHoursBreakpoints as Record<number, number>;

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


    public draw(): void {
        this.game.ctx.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        const yOrderedObjects = this.visibleObjects.sort((a, b) => a.y - b.y);

        for (let object of yOrderedObjects) {
            object.draw();
        }

        this.drawShadow();
    }

    // Light and shadow

    public drawShadow(): void {
        const { width, height } = this.game.shadowCanvas;
        this.game.shadowCtx.clearRect(0, 0, width, height);

        // draw hero light

        let radius = 50;
        let x = this.camera.left + this.hero.x + this.hero.areaWidth/2;
        let y = this.camera.top + this.hero.y + this.hero.areaHeight/2;
        let grd = this.game.shadowCtx.createRadialGradient(x, y, 0, x, y, radius);
        grd.addColorStop(0.0, "rgba(0, 0, 0, 0.2)");
        grd.addColorStop(0.5, "rgba(0, 0, 0, 0.1)");
        grd.addColorStop(1.0, "rgba(0, 0, 0, 0.0)");
        this.game.shadowCtx.fillStyle = grd;
        this.game.shadowCtx.fillRect(x - radius, y - radius, (radius * 2), (radius * 2));


        // draw luminous objects

        for (let luminous of this.luminousObjects) {
            let x = this.camera.left + luminous.x + luminous.areaWidth/2;
            let y = this.camera.top + luminous.y + luminous.areaHeight/2;
            const { luminousRadius } = luminous;
            let grd = this.game.shadowCtx.createRadialGradient(x, y, 0, x, y, luminousRadius);
            grd.addColorStop(0.0, "rgba(0, 0, 0, 1.0)");
            grd.addColorStop(0.7, "rgba(0, 0, 0, 0.6)");
            grd.addColorStop(1.0, "rgba(0, 0, 0, 0.0)");
            this.game.shadowCtx.fillStyle = grd;
            this.game.shadowCtx.fillRect(x - luminousRadius, y - luminousRadius, (luminousRadius * 2), (luminousRadius * 2));
        }

        // apply daylight

        const breakpoints = (Object.keys(this.daylightAlphaHoursBreakpoints) as unknown as number[]);
        const currentBreakpoint = Math.max(...breakpoints.filter(a => a <= this.dayMinutes));
        const alpha = this.daylightAlphaHoursBreakpoints[currentBreakpoint];

        this.game.shadowCtx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        this.game.shadowCtx.fillRect(0, 0, width, height);

        // reverse alphas

        const canvasData = this.game.shadowCtx.getImageData(0, 0, width, height);
        const data = canvasData.data;

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const index = 4 * (x + y * width);
                const alpha = data[index + 3];
                data[index + 3] = 255 - alpha - 20;
            }
        }

        this.game.shadowCtx.putImageData(canvasData, 0, 0);

        // draw in final canvas

        this.game.ctx.drawImage(this.game.shadowCanvas, 0, 0, width, height);
    }
}
