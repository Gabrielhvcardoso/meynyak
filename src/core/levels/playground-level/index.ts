import { Hero } from "@/core/entities/hero";
import { KeyboardHandler } from "../../keyboard-handler";
import { Level } from "../../level";
import gameObjects from "./game-objects.json"

export class PlaygroundLevel extends Level {
    setup() {
        const hero = new Hero(this.game, gameObjects.hero);

        this.objects = [hero];

        this.game.keyboardHandler = new KeyboardHandler({
            keyEvents: {},
        });
    }
}