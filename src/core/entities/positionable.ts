import { Game } from "../game";
import { GameObject } from "./game-object";
import { Moveable } from "./moveable";
import { Sprite } from "./sprite";

export type AnimationSequence = number[];

export interface PositionableConfig {
    x: number;
    y: number;
    height: number;
    width: number;
    solid: boolean;

    source: string|string[];
    frameHeight: number;
    frameWidth: number;
    animations: Record<string, AnimationSequence>
}

export abstract class Positionable extends GameObject {
    x: number;
    y: number;
    height: number;
    width: number;
    solid: boolean;

    sprites: Sprite[] = [];
    animations: Record<string, AnimationSequence>;
    animationName: string;
    animationStep: number;
    animationDimension: [number, number];

    /** Return the sequence with frames pointers */
    get currentAnimation(): AnimationSequence {
        return this.animations[this.animationName];
    }

    /** Return the left padding in pixels of current frame */
    get currentAnimationFrameLeft(): number {
        return this.animationDimension[0] * (this.currentAnimation[this.animationStep] - 1);
    }

    constructor(game: Game, config: PositionableConfig) {
        super(game);

        this.x = config.x;
        this.y = config.y;
        this.height = config.height;
        this.width = config.width;
        this.solid = config.solid;

        this.animations = config.animations;
        this.animationName = Object.keys(config.animations)[0];
        this.animationStep = 0;
        this.animationDimension = [config.frameWidth, config.frameHeight];

        const sourceList: string[] = Array.isArray(config.source) ? config.source : [config.source];
        for (let i = 0; i < sourceList.length; i++) {
            let src = sourceList[i];
            let sprite = new Sprite({ src });
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
    }

    /** Draw method called on tick */
    public draw(): void {
        if (!this.game.level) return;

        for (let i = 0; i < this.sprites.length; i++) {
            let sprite = this.sprites[i];

            const { left, top } = this.game.level.camera;

            if (sprite.image) {
                this.game.ctx.save();
                this.game.ctx.translate(left + this.x + this.width/2, top + this.y + this.height/2);

                if ('side' in this && this.side === 'left') {
                    this.game.ctx.scale(-1, 1);
                }

                this.game.ctx.drawImage(
                    sprite.image,
                    this.currentAnimationFrameLeft, 0,
                    this.animationDimension[0], this.animationDimension[1],
                    -this.width/2, -this.height/2,
                    this.width, this.height,
                );

                this.game.ctx.restore();
            }
        }
    };
}
