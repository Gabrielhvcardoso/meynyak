import daylightAlphaHoursBreakpoints from './data/daylight-alpha-hours-breakpoints.json';

import { Game } from "./game";
import { GameUI } from './game-ui';
import { Level } from "./level";

export class LevelDrawer {
    private game: Game;
    private gameUI: GameUI;

    readonly daylightAlphaHoursBreakpoints = daylightAlphaHoursBreakpoints as Record<number, number>;

    constructor(game: Game) {
        this.game = game;
        this.gameUI = new GameUI(game);
    }

    update() {
        this.draw();
    }

    // Draw

    public draw(): void {
        const { width, height } = this.game.canvas;

        // draw
        this.game.ctx.clearRect(0, 0, width, height);
        this.drawObjects();

        // lighting
        this.game.shadowCtx.clearRect(0, 0, width, height);
        this.applyDynamicLight();
        this.reverseAlphas();

        // hud
        this.gameUI.draw();
    }

    private drawObjects(): void {
        if (!this.game.level) return;

        const yOrderedObjects = this.game.level.visibleObjects.sort((a, b) => a.y - b.y);

        for (let object of yOrderedObjects) {
            object.draw();
        }
    }

    // Light and shadow

    private applyDynamicLight(): void {
        if (!this.game.level) return;

        const { width, height } = this.game.shadowCanvas;
        const clock = this.game.level.levelClock;

        // draw luminous objects

        for (let luminous of this.game.level.luminousObjects) {
            let x = this.game.level.camera.left + luminous.x + luminous.areaWidth/2;
            let y = this.game.level.camera.top + luminous.y + luminous.areaHeight/2;
            const { luminousRadius } = luminous;
            let grd = this.game.shadowCtx.createRadialGradient(x, y, 0, x, y, luminousRadius);

            for (let colorStop of luminous.luminousColorsStops) {
                grd.addColorStop(colorStop.offset, colorStop.color);
            }

            this.game.shadowCtx.fillStyle = grd;
            this.game.shadowCtx.fillRect(x - luminousRadius, y - luminousRadius, (luminousRadius * 2), (luminousRadius * 2));
        }

        // apply daylight

        const breakpoints = (Object.keys(this.daylightAlphaHoursBreakpoints) as unknown as number[]);
        const currentBreakpoint = Math.max(...breakpoints.filter(a => a <= clock.dayMinutes));
        const alpha = this.daylightAlphaHoursBreakpoints[currentBreakpoint];

        this.game.shadowCtx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        this.game.shadowCtx.fillRect(0, 0, width, height);
    }

    private reverseAlphas() {
        const { width, height } = this.game.shadowCanvas;

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