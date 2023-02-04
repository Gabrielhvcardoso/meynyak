import { Game } from "../game";
import { KeyboardHandler, KeyEvents } from "../keyboard-handler";
import { getCoordinatesDistance } from "../utils/get-coordinates-distance";
import { Character, CharacterConfig } from "./character";
import { Interactive } from "./interactive";
import { Luminous } from "./luminous";

interface ObjectDistance {
    distance: number;
    obj: Interactive;
}

interface HeroConfig extends CharacterConfig {}

export class Hero extends Character implements Luminous {

    luminous = true;
    luminousRadius = this.game.canvas.height;
    luminousColorsStops = [
        { offset: 0.0, color: 'rgba(0, 0, 0, 0.05)' },
        { offset: 0.2, color: 'rgba(0, 0, 0, 0.05)' },
        { offset: 1.0, color: 'rgba(0, 0, 0, 0.0)' },
    ]

    constructor(game: Game, heroConfig: HeroConfig) {
        super(game, heroConfig);
    }

    getKeyEvents(): KeyEvents {
        return ({
            65: () => this.move('left', KeyboardHandler.states.shift),
            68: () => this.move('right', KeyboardHandler.states.shift),
            83: () => this.move('down', KeyboardHandler.states.shift),
            87: () => this.move('up', KeyboardHandler.states.shift),
        });
    }

    update() {
        super.update();
        this.setHeroInteractivityTarget();
    }

    setHeroInteractivityTarget(): void {
        const interactiveObjects: ObjectDistance[] = [];

        this.game.level?.visibleObjects.forEach((obj) => {
            if (obj.id === this.id) return;

            if (obj instanceof Interactive && obj.interactive) {
                let distance = getCoordinatesDistance(this.center, obj.center);

                if (distance <= this.interactivityRange) {
                    interactiveObjects.push({ obj, distance })
                }
            }
        });

        if (!interactiveObjects) {
            Interactive.heroTargetId = null;
            return;
        }

        const closestObject = interactiveObjects.reduce<ObjectDistance|null>((prev, cur) => {
            if (!prev) return cur;
            return prev.distance <= cur.distance ? prev : cur;
        }, null);

        Interactive.heroTargetId = closestObject ? closestObject.obj.id : null;
    }
}
