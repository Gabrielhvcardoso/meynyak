interface SpriteConfig {
    src: string;
}

export class Sprite {
    private static images = new Map<string, HTMLImageElement | null>([]);

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
    }
}
