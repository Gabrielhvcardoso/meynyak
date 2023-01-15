import { KeyboardHandler } from "../keyboard-handler";
import { Level } from "../level";

export class PlaygroundLevel extends Level {
    setup() {
        this.game.keyboardHandler = new KeyboardHandler({
            keyEvents: {},
        });
    }
}