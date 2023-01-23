import { Luminous } from "../entities/luminous";
import { Game } from "../game";

export class BonfireFactory {
    static factory(game: Game, x: number, y: number): Luminous {
        const bonfire = new Luminous(game, {
            luminousRadius: 100,
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
            animations: {
                idle: [1, 2, 3, 4, 5, 6, 7, 8]
            }
        });

        return bonfire;
    }
}
