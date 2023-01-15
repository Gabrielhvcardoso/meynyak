import { Game } from "../game";
import { Positionable, PositionableConfig } from "./positionable";

export interface InteractiveConfig extends PositionableConfig {}

export abstract class Interactive extends Positionable {
    constructor(game: Game, config: InteractiveConfig) {
        super(game, config);
    }
}
