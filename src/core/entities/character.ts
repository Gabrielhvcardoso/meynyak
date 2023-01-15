import { Game } from "../game";
import { Moveable, MoveableConfig } from "./moveable";

export interface CharacterConfig extends MoveableConfig {}

export abstract class Character extends Moveable {
    constructor(game: Game, config: CharacterConfig) {
        super(game, config);
    }
}
