import { Game } from "../game";
import { GameObject } from "./game-object";
import { Sprite } from "./sprite";

export type AnimationSequence = number[];

export interface SpriteLayer {
    src: string;
    z?: number;
    at?: [number, number]
}

export interface PositionableConfig {
    x: number;
    y: number;
    areaHeight: number;
    areaWidth: number;
    solid: boolean;
    
    layers: SpriteLayer|SpriteLayer[];
    frameHeight: number;
    frameWidth: number;
    frameOffsetX?: number;
    frameOffsetY?: number;
    animations: Record<string, AnimationSequence>
}

export class Positionable extends GameObject {
    x: number;
    y: number;
    areaHeight: number;
    areaWidth: number;
    solid: boolean;

    sprites: Sprite[] = [];

    animations: Record<string, AnimationSequence>;
    animationName: string;
    animationStep: number;

    /** Return the sequence with frames pointers */
    get currentAnimation(): AnimationSequence {
        return this.animations[this.animationName];
    }

    constructor(game: Game, config: PositionableConfig) {
        super(game);

        this.x = config.x;
        this.y = config.y;
        this.areaHeight = config.areaHeight;
        this.areaWidth = config.areaWidth;
        this.solid = config.solid;

        this.animations = config.animations;
        this.animationName = Object.keys(config.animations)[0];
        this.animationStep = 0;

        const layerList: SpriteLayer[] = Array.isArray(config.layers) ? config.layers : [config.layers];
        for (let i = 0; i < layerList.length; i++) {
            let layer = layerList[i];
            let sprite = new Sprite({
                src: layer.src,
                x: this.x,
                y: this.y,
                z: layer.z ?? 0,
                frameStart: layer.at ?? [1, 1],
                frameWidth: config.frameWidth,
                frameHeight: config.frameHeight,
                frameOffsetX: config.frameOffsetX ?? 0,
                frameOffsetY: config.frameOffsetY ?? 0,
            });
            this.sprites.push(sprite);
        }
    }

    public setAnimationName(animationName: string): void {
        this.animationName = animationName;
    }

    public update(): void {
        // update animation step
        const nextAnimationStep = this.animationStep + 1;
        this.animationStep = (nextAnimationStep < this.currentAnimation.length) ? nextAnimationStep : 0;

        // update sprite position
        for (let sprite of this.sprites) {
            sprite.x = this.x;
            sprite.y = this.y;
        }
    }

    /** Draw method called on tick */
    public draw(): void {
        if (!this.game.level) return;

        if (process.env.DEBUG) {
            this.game.ctx.fillStyle = 'green';
            this.game.ctx.fillRect(this.game.level.camera.left + this.x, this.game.level.camera.top + this.y, this.areaWidth, this.areaHeight);
        }

        for (let sprite of this.sprites) {
            let camera = this.game.level.camera;
            let frameCol = this.currentAnimation[this.animationStep];
            let frameRow = 1;
            let flipHorizontal = 'side' in this && this.side === 'left';
            let flipVertical = false;
            sprite.draw(this.game.ctx, frameCol, frameRow, camera, flipHorizontal, flipVertical);
        }
    };
}
