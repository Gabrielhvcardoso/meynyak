import { Game } from "../game";
import { KeyboardHandler, KeyEvents } from "../keyboard-handler";
import { Character, CharacterConfig } from "./character";

interface HeroConfig extends CharacterConfig {}

export class Hero extends Character {
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
}
