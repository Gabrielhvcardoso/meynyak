import { Hero } from "@/core/entities/hero";
import { Positionable } from "@/core/entities/positionable";
import { Game } from "@/core/game";
import { TreeFactory } from "@/core/factories/tree-factory";
import { KeyboardHandler } from "../../keyboard-handler";
import { Level } from "../../level";
import gameObjects from "./game-objects.json"

export class PlaygroundLevel extends Level {
    constructor(game: Game) {
        const hero = new Hero(game, gameObjects.hero);

        const objects: Positionable[] = [
            ...TreeFactory.multiFactory(game, {
                x: -500,
                y: -100,
                width: 1000,
                height: 100,
            }),
        ];

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