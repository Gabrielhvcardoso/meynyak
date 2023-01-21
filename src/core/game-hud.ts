import { Game } from "./game";
import { TextDrawer } from "./text-drawer";

export class GameHUD {
    constructor(private game: Game) {}

    draw() {
        if (!this.game.level) return;

        const { health, maxHealth, armor, maxArmor, stamina, maxStamina } = this.game.level.hero;

        const barWidth = 48;
        const barHeight = 1;
        const barPadding = 1;
        const barGap = 1;

        const healthBar = Math.round(barWidth * health / maxHealth);
        const armorBar = Math.round(barWidth * armor / maxArmor);
        const staminaBar = Math.round(barWidth * stamina / maxStamina);

        let top = 2;
        let left = 2;

        this.game.ctx.fillStyle = 'white';
        this.game.ctx.fillRect(left, top, barWidth+barPadding*2, barHeight+barPadding*2);
        this.game.ctx.fillStyle = 'red';
        this.game.ctx.fillRect(left+barPadding, top+barPadding, healthBar, barHeight);

        top += barHeight + barPadding*2 + barGap;

        this.game.ctx.fillStyle = 'white';
        this.game.ctx.fillRect(left, top, barWidth+barPadding*2, barHeight+barPadding*2);
        this.game.ctx.fillStyle = 'grey';
        this.game.ctx.fillRect(left+barPadding, top+barPadding, armorBar, barHeight);

        top += barHeight + barPadding*2 + barGap;

        this.game.ctx.fillStyle = 'white';
        this.game.ctx.fillRect(left, top, barWidth+barPadding*2, barHeight+barPadding*2);
        this.game.ctx.fillStyle = 'green';
        this.game.ctx.fillRect(left+barPadding, top+barPadding, staminaBar, barHeight);

        top += barHeight + barPadding*2 + barGap;

        const hour = this.game.level.hour.toLocaleString('pt-br', { minimumIntegerDigits: 2 });
        const minutes = this.game.level.hourMinutes.toLocaleString('pt-br', { minimumIntegerDigits: 2 });

        this.game.ctx.fillStyle = 'white';
        this.game.ctx.fillRect(left, top, 21, 5);

        top += 1;
        left += 1;

        TextDrawer.drawText(`${hour}:${minutes}`, this.game.ctx, left, top);
    }
}
