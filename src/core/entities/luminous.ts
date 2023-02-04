import { Game } from "../game";
import { Positionable, PositionableConfig } from "./positionable";

export interface LuminousConfig extends PositionableConfig {
    luminousRadius: number;
    luminousColorsStops: ColorStops[];
}

export interface ColorStops {
    offset: number;
    color: string;
}

export class Luminous extends Positionable {
    luminous = true;
    luminousRadius: number;
    luminousColorsStops: ColorStops[];

    constructor(game: Game, config: LuminousConfig) {
        super(game, config);
        this.luminousRadius = config.luminousRadius;
        this.luminousColorsStops = config.luminousColorsStops;
    }
}
