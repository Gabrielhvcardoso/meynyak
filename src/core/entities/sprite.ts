import { CameraAnchors } from "../level";

interface SpriteConfig {
    src: string;
    x: number;
    y: number;
    z: number;

    frameHeight: number;
    frameWidth: number;
    frameStart: [number, number];

    frameOffsetX: number;
    frameOffsetY: number;
}

export class Sprite {
    private static images = new Map<string, HTMLImageElement | null>([]);

    x: number;
    y: number;
    z: number;
    frameHeight: number;
    frameWidth: number;
    frameStart: [number, number];
    frameOffsetX: number;
    frameOffsetY: number;

    get image(): HTMLImageElement | null {
        return Sprite.images.get(this.config.src) ?? null;
    }

    constructor(private config: SpriteConfig) {
        if (!Sprite.images.has(this.config.src)) {
            Sprite.images.set(this.config.src, null);
            const image = new Image();
            image.src = this.config.src;
            image.onload = () => Sprite.images.set(this.config.src, image);
        }

        this.x = config.x;
        this.y = config.y;
        this.z = config.z;
        this.frameWidth = config.frameWidth;
        this.frameHeight = config.frameHeight;
        this.frameStart = config.frameStart;
        this.frameOffsetX = config.frameOffsetX;
        this.frameOffsetY = config.frameOffsetY;
    
    }

    public draw(
        ctx: CanvasRenderingContext2D,
        frameCol: number = 1,
        frameRow: number = 1,
        camera: CameraAnchors|null|undefined = null,
        flipHorizontal = false,
        flipVertical = false,
    ): void {
        if (this.image) {
            const { left, top } = camera || { left: 0, top: 0 };

            const x = this.frameOffsetX + this.x + left + this.frameWidth/2;
            const y = this.frameOffsetY + this.y + top + this.frameHeight/2 - (this.z*this.frameHeight);

            ctx.save();
            ctx.translate(x, y);
            ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);

            const frameLeft = (this.frameStart[0]-1)*this.frameWidth + this.frameWidth*(frameCol-1);
            const frameTop = (this.frameStart[1]-1)*this.frameHeight + this.frameHeight*(frameRow-1);

            ctx.drawImage(
                this.image,
                frameLeft, frameTop,
                this.frameWidth, this.frameHeight,
                -this.frameWidth/2, -this.frameHeight/2,
                this.frameWidth, this.frameHeight,
            );

            ctx.restore();
        }
    };
}
