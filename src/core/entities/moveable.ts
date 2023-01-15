import { Game } from "../game";
import { Interactive, InteractiveConfig } from "./interactive";

export interface MoveableConfig extends InteractiveConfig {}

export abstract class Moveable extends Interactive {
    constructor(game: Game, config: MoveableConfig) {
        super(game, config);
    }
}
