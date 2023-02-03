import skinsConfig from "./data/skins.json";

import { Game } from "./game";
import { Sprite } from "./entities/sprite";
import { SkinPart } from "./types/skin-parts";
import { KeyboardHandler } from "./keyboard-handler";

interface GameSave {
    label: string;
    level: string;
    data: any;
}

interface MenuItem {
    label: string;
    action: () => void;
}

const SAVES = [
    {
        label: 'veigorxx',
        level: 'playground-level',
        data: {}
    }
];

export class GameMenu {

    // Skin Management
    sprites: Record<string, Sprite> = {};
    skins: Record<SkinPart, { prefix: string, items: number[] }>;
    skinAnimationName = 'stand';
    skinAnimationStep = 1;
    skinAnimations = [1];

    // Skin Cursor
    skinCursor: SkinPart = 'head';
    skinInFocus: Record<SkinPart, number> = { back_arm: 0, back_leg: 0, front_leg: 0, chest: 0, front_arm: 0, head: 0 };

    // Saves Management
    saves: GameSave[];
    menuCursor = 0;
    menuItems: MenuItem[];

    constructor(private game: Game) {

        this.start('playground-level');

        // Skins
        this.skins = skinsConfig;
        for (let key in this.skins) {
            const { items, prefix } = this.skins[key as SkinPart];
            for (let item of items) {
                const sprite = new Sprite({
                    src: `/assets/sprites/${prefix + item}.png`,
                    frameWidth: 32,
                    frameHeight: 32,
                    frameOffsetX: 0,
                    frameOffsetY: 0,
                    frameStart: [1, 1],
                    x: 24,
                    y: 16,
                    z: 0,
                });
                this.sprites[prefix+item] = sprite;
            }
        }

        // Saves
        this.saves = SAVES;
        this.menuItems = [
            ...SAVES.map<MenuItem>((save) => ({
                label: `[${save.label}]`,
                action: () => this.start(save.level),
            })),

            {
                label: '[NOVO]',
                action: () => console.log('novo')
            }
        ]

        this.game.keyboardHandler = new KeyboardHandler({
            keyEvents: {
                13: () => this.handleEnter(),
                83: () => this.moveCursor('down'),
                87: () => this.moveCursor('up'),
            }
        });
    }

    private handleEnter() {
        this.menuItems[this.menuCursor].action();
    }

    private moveCursor(direction: 'up'|'down') {
        switch(direction) {
            case 'down':
                if (this.menuCursor < this.menuItems.length - 1) {
                    this.menuCursor += 1;
                } else {
                    this.menuCursor = 0;
                }
                break;

            case 'up':
                if (this.menuCursor === 0) {
                    this.menuCursor = this.menuItems.length - 1;
                } else {
                    this.menuCursor -= 1;
                }
                break;
        }
    }

    private async start(levelName: string) {
        const module = (await import(`./levels/${levelName}`));
        const level = new module.PlaygroundLevel(this.game);

        this.game.level = level;
    }

    update() {
        this.game.keyboardHandler?.update();

        const nextAnimationStep = this.skinAnimationStep + 1;
        this.skinAnimationStep = nextAnimationStep < this.skinAnimations.length
            ? nextAnimationStep
            : 1;
    }

    draw() {
        this.game.ctx.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        
        for (let key in this.skinInFocus) {
            const inFocus = key + '_' + this.skinInFocus[key as SkinPart]
            const animationStep = this.skinAnimations[this.skinAnimationStep];
            this.sprites[inFocus]?.draw(this.game.ctx, animationStep, 1, undefined, undefined, undefined, 3)
        }

        // Menu

        const MenuLeft = 140;
        const MenuWidth = 120;
        const MenuTop = 25;

        this.game.ctx.fillStyle = 'white'
        this.game.ctx.imageSmoothingEnabled = true

        if (process.env.DEBUG) {
            this.game.ctx.fillStyle = 'green';
            this.game.ctx.fillRect(MenuLeft, 25, MenuWidth, 100);
        }

        this.game.ctx.fillStyle = 'white';

        const TitleTop = MenuTop + 25;

        this.game.ctx.font = '26px VT323';
        this.game.ctx.textAlign = 'center';
        this.game.ctx.fillText('MEYNYAK', MenuLeft+MenuWidth/2, TitleTop, MenuWidth);

        let SavesTop = TitleTop + 16;
        let TextHeight = 12;

        this.game.ctx.font = '14px VT323';
        this.game.ctx.textAlign = 'center';

        const CursorSize = 3;
        let menuCursor = 0;

        for (let item of this.menuItems) {
            if (this.menuCursor === menuCursor) {
                this.game.ctx.fillRect(MenuLeft + 4, SavesTop - (TextHeight)/2, CursorSize, CursorSize);
            }

            this.game.ctx.fillText(item.label.toUpperCase(), MenuLeft+MenuWidth/2, SavesTop, MenuWidth);
            SavesTop += TextHeight
            menuCursor++;
        }
    }
}
