import { Hero } from "@/core/entities/hero";
import { Positionable, PositionableConfig } from "@/core/entities/positionable";
import { Game } from "@/core/game";
import { KeyboardHandler } from "../../keyboard-handler";
import { Level } from "../../level";
import gameObjects from "./game-objects.json"

export class PlaygroundLevel extends Level {
    constructor(game: Game) {
        const hero = new Hero(game, gameObjects.hero);
        const objects: Positionable[] = [];

        for (let tree of gameObjects.trees) {
            objects.push(new Positionable(game, tree as unknown as PositionableConfig));
        }


        super(game, objects, hero, hero.id);
    }

    setup() {
        const heroKeyEvents = this.hero.getKeyEvents();
        this.game.keyboardHandler = new KeyboardHandler({
            keyEvents: {
                ...heroKeyEvents
            },
        });
    }
}