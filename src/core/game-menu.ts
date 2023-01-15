import { Game } from "./game";

export class GameMenu {
    constructor(private game: Game) {
        this.init();
    }

    async init() {
        const module = (await import('./levels/playground.level'));
        const level = new module.PlaygroundLevel(this.game);

        this.game.level = level;
    }

    draw() {
        this.game.ctx.fillStyle = 'red';
        this.game.ctx.fillRect(0, 0, 100, 100)
    }
}
