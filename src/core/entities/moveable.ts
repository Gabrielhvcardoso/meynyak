import { Game } from "../game";
import { Direction } from "../types/direction";
import { Side } from "../types/side";
import { Interactive, InteractiveConfig } from "./interactive";

export interface MoveableConfig extends InteractiveConfig {
    speed: number;
    stamina: number;
}

export abstract class Moveable extends Interactive {

    public moving = false;
    public running = false;

    public speed: number;
    public stamina: number;
    public maxStamina: number;

    public side: Side = 'right';

    private moveTimeout: NodeJS.Timeout | undefined;
    private staminaInterval: NodeJS.Timer | undefined;

    constructor(game: Game, { speed, stamina, ...config }: MoveableConfig) {
        super(game, config);
        this.speed = speed;
        this.stamina = stamina;
        this.maxStamina = stamina;

        this.startStaminaRestore();
    }

    startStaminaRestore(): void {
        if (this.staminaInterval) clearInterval(this.staminaInterval);

        this.staminaInterval = setInterval(() => {
            if (!this.running) {
                this.stamina = Math.min(this.maxStamina, this.stamina + 20);
            }
        }, 500);
    }

    move(direction: Direction, shouldRun = false): void {
        if (shouldRun && this.stamina < 5) {
            shouldRun = false;
        }

        const change = (['left', 'up'].includes(direction) ? -this.speed : this.speed) * (shouldRun ? 2 : 1);
        const nextX = this.x + (['left', 'right'].includes(direction) ? change : 0);
        const nextY = this.y + (['down', 'up'].includes(direction) ? change : 0);

        if (this.canMoveTo(nextX, nextY)) {

            if (['left', 'right'].includes(direction)) {
                this.side = direction as Side;
            }

            this.moving = true;
            this.running = shouldRun;

            if (shouldRun) {
                this.stamina -= 5;
            }

            this.setAnimationName(shouldRun ? 'run' : 'walk');

            this.x = nextX;
            this.y = nextY;

            if (this.moveTimeout) {
                clearTimeout(this.moveTimeout);
            }

            this.moveTimeout = setTimeout(() => {
                this.setAnimationName('stand');
                this.moving = false;
                this.running = false;
            }, 100);
        }
    }

    canMoveTo(x: number, y: number): boolean {
        if (!this.game.level) return false;
        const objects = this.game.level.solidObjects;
        let colision = false;

        for (let object of objects) {
            let hIntersect = (x + this.areaWidth) > object.x && x < (object.x + object.areaWidth);
            let vIntersect = (y + this.areaHeight) > object.y && y < (object.y + object.areaHeight);

            if (hIntersect && vIntersect) {
                colision = true;
                break;
            }
        }

        return !colision;
    }
}
