import { Game } from "../game";
import { Character, CharacterConfig } from "./character";

interface HeroConfig extends CharacterConfig {}

export class Hero extends Character {
    constructor(game: Game, heroConfig: HeroConfig) {
        super(game, heroConfig);
    }
}
