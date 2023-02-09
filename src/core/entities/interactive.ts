import { Game } from "../game";
import { getCoordinatesDistance } from "../utils/get-coordinates-distance";
import { Positionable, PositionableConfig } from "./positionable";

export interface InteractiveConfig extends PositionableConfig {
    interactivityRange: number;
    interactivityHint: boolean;
}

export abstract class Interactive extends Positionable {

    public static heroTargetId: null|string = null;

    get isTarget(): boolean {
        return Interactive.heroTargetId === this.id;
    }

    interactive = true;
    public interactivityRange: number;
    public interactivityHint: boolean;

    constructor(game: Game, config: InteractiveConfig) {
        super(game, config);

        this.interactivityRange = config.interactivityRange;
        this.interactivityHint = config.interactivityHint;
    }

    public abstract handleInteractivity(): void;

    public getAffectedObjects(): Positionable[] {
        if (!this.game.level) return [];

        const { visibleObjects } = this.game.level;

        const affectedObjects = visibleObjects.filter(obj => {
            const distance = getCoordinatesDistance(this.center, obj.center);
            return distance >= this.interactivityRange;
        });

        return affectedObjects;
    }
}
