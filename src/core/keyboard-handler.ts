export type KeyEvents = Record<number, () => void>;

export interface KeyboardConfig {
    keyEvents: KeyEvents;
}

export class KeyboardHandler {
    private static listening = false;
    public static keys: Record<number, boolean> = {};
    public static states = {
        shift: false,
        ctrl: false,
        alt: false,
    }

    constructor(private config: KeyboardConfig) {
        if (!KeyboardHandler.listening) {
            KeyboardHandler.listening = true;

            window.addEventListener('keydown', (e: KeyboardEvent) => {
                KeyboardHandler.keys[e.keyCode] = true;
            });

            window.addEventListener('keyup', (e: KeyboardEvent) => {
                KeyboardHandler.keys[e.keyCode] = false;
            });

            window.addEventListener('keydown', (e: KeyboardEvent) => {
                if (e.keyCode === 16) KeyboardHandler.states.shift = true;
                if (e.keyCode === 17) KeyboardHandler.states.ctrl = true;
                if (e.keyCode === 18) KeyboardHandler.states.alt = true;
            });

            window.addEventListener('keyup', (e: KeyboardEvent) => {
                if (e.keyCode === 16) KeyboardHandler.states.shift = false;
                if (e.keyCode === 17) KeyboardHandler.states.ctrl = false;
                if (e.keyCode === 18) KeyboardHandler.states.alt = false;
            });
        }
    }

    update() {
        for (let key in this.config.keyEvents) {
            if (KeyboardHandler.keys[key]) {
                this.config.keyEvents[key]();
            }
        }
    }
}
