import { Interactive } from "../entities/interactive";
import { Luminous } from "../entities/luminous";
import { Game } from "../game";

export class Bonfire extends Interactive implements Luminous {

    luminous = true;
    luminousRadius = 100;

    readonly ILLUM_RADIUS = 100;
    readonly ILLUM_OSCILLATION = 10;
    readonly ILLUM_FREQUENCY = 2;

    constructor(game: Game, x: number, y: number) {
        super(game, {
            x,
            y,
            areaHeight: 16,
            areaWidth: 16,
            solid: true,
            layers: [{ src: '/assets/sprites/bonfire.png' }],
            frameHeight: 32,
            frameWidth: 32,
            frameOffsetX: -8,
            frameOffsetY: -16,
            animations: { idle: [1, 2, 3, 4, 5, 6, 7, 8] },
            interactivityRange: 50,
            interactivityHint: false
        });
    }

    update() {
        super.update();
        this.oscillateBonfireIllumination(this.game.deltaTime);
    }

    /**
     * Updates the illumination radius using a sinusoidal function
     */
    oscillateBonfireIllumination(deltaTime: number): void {
        this.luminousRadius = this.ILLUM_RADIUS + this.ILLUM_OSCILLATION * Math.sin(this.ILLUM_FREQUENCY * deltaTime);
    }
}
