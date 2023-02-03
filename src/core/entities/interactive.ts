import { Game } from "../game";
import { Positionable, PositionableConfig } from "./positionable";

export interface InteractiveConfig extends PositionableConfig {
    interactivityRange: number;
    interactivityHint: boolean;
}

export abstract class Interactive extends Positionable {
    public interactivityRange: number;
    public interactivityHint: boolean;

    constructor(game: Game, config: InteractiveConfig) {
        super(game, config);

        this.interactivityRange = config.interactivityRange;
        this.interactivityHint = config.interactivityHint;
    }
}
