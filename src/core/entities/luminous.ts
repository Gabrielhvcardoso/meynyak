import { Game } from "../game";
import { Positionable, PositionableConfig } from "./positionable";

export interface LuminousConfig extends PositionableConfig {
    luminousRadius: number;
}

export class Luminous extends Positionable {
    luminous = true;
    luminousRadius: number;

    constructor(game: Game, config: LuminousConfig) {
        super(game, config);
        this.luminousRadius = config.luminousRadius;
    }
}
