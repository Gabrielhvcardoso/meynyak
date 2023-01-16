import { Game } from "../game";
import { Direction } from "../types/direction";
import { Side } from "../types/side";
import { Interactive, InteractiveConfig } from "./interactive";

export interface MoveableConfig extends InteractiveConfig {
    speed: number;
}

export abstract class Moveable extends Interactive {

    public speed: number;
    public side: Side = 'right';

    private moveTimeout: NodeJS.Timeout | undefined;

    constructor(game: Game, { speed, ...config }: MoveableConfig) {
        super(game, config);
        this.speed = speed;
    }

    move(direction: Direction, shouldRun = false): void {
        const change = (['left', 'up'].includes(direction) ? -this.speed : this.speed) * (shouldRun ? 2 : 1);
        const nextX = this.x + (['left', 'right'].includes(direction) ? change : 0);
        const nextY = this.y + (['down', 'up'].includes(direction) ? change : 0);

        if (this.canMoveTo(nextX, nextY)) {
            if (['left', 'right'].includes(direction)) {
                this.side = direction as Side;
            }

            this.setAnimationName(shouldRun ? 'run' : 'walk');

            this.x = nextX;
            this.y = nextY;

            if (this.moveTimeout) {
                clearTimeout(this.moveTimeout);
            }

            this.moveTimeout = setTimeout(() => {
                this.setAnimationName('stand');
            }, 100);
        }
    }

    canMoveTo(x: number, y: number): boolean {
        if (!this.game.level) return false;
        const objects = this.game.level.solidObjects;
        let colision = false;

        for (let object of objects) {
            let hIntersect = (x + this.width) > object.x && x < (object.x + object.width);
            let vIntersect = (y + this.height) > object.y && y < (object.y + object.height);

            if (hIntersect && vIntersect) {
                colision = true;
                break;
            }
        }

        return !colision;
    }
}
