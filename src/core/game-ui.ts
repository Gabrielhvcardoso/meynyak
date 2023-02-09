import { Interactive } from "./entities/interactive";
import { Game } from "./game";
import { TextDrawer } from "./text-drawer";
import { Side } from "./types/side";

export class GameUI {

    constructor(private game: Game) {}

    draw() {
        this.drawHeroStats();
        this.drawInteractiveHint();
    }

    private drawHeroStats(): void {
        if (!this.game.level) return;


        // config
        const barWidth = 48;
        const barHeight = 1;
        const barPadding = 1;
        const barGap = 1;

        const barColors = {
            health:  { bg: '#8D0801', main: '#BF0603' },
            armor:   { bg: '#474747', main: '#808080' },
            stamina: { bg: '#385154', main: '#708D81' }
        };


        // draw
        const { health, maxHealth, armor, maxArmor, stamina, maxStamina } = this.game.level.hero;
        
        const healthBar = Math.round(barWidth * health / maxHealth);
        const armorBar = Math.round(barWidth * armor / maxArmor);
        const staminaBar = Math.round(barWidth * stamina / maxStamina);
        let top = 2;
        let left = 2;

        this.game.ctx.fillStyle = barColors.health.bg;
        this.game.ctx.fillRect(left+barPadding, top+barPadding, barWidth, barHeight);
        this.game.ctx.fillStyle = barColors.health.main;
        this.game.ctx.fillRect(left+barPadding, top+barPadding, healthBar, barHeight);

        top += barHeight + barPadding + barGap;
        this.game.ctx.fillStyle = barColors.armor.bg;
        this.game.ctx.fillRect(left+barPadding, top+barPadding, barWidth, barHeight);
        this.game.ctx.fillStyle = barColors.armor.main;
        this.game.ctx.fillRect(left+barPadding, top+barPadding, armorBar, barHeight);

        top = this.game.canvas.height - barHeight - barPadding - barGap;
        this.game.ctx.fillStyle = barColors.stamina.bg;
        this.game.ctx.fillRect(left+barPadding, top, barWidth, barHeight);
        this.game.ctx.fillStyle = barColors.stamina.main;
        this.game.ctx.fillRect(left+barPadding, top, staminaBar, barHeight);

        // Clock

        // const clock = this.game.level.levelClock;
        // top += barHeight + barPadding*2 + barGap;
        // const hour = clock.hour.toLocaleString('pt-br', { minimumIntegerDigits: 2 });
        // const minutes = clock.hourMinutes.toLocaleString('pt-br', { minimumIntegerDigits: 2 });
        // this.game.ctx.fillStyle = 'white';
        // this.game.ctx.fillRect(left, top, 21, 5);
        // top += 1;
        // left += 1;
        // TextDrawer.drawText(`${hour}:${minutes}`, this.game.ctx, left, top);
    }

    public drawInteractiveHint(): void {
        if (!this.game.level) return;

        const { hero, camera } = this.game.level;

        const targetId = Interactive.heroTargetId;
        const object = targetId ? this.game.level?.objects.find(({ id }) => id === targetId) : null;

        if (!object) return;

        if (object instanceof Interactive && object.interactivityHint) {
            const side: Side = hero.center.x > object.center.x ? 'right' : 'left';

            const x = camera.left + (side === 'left' ? (object.frameLimits.left - 5) : (object.frameLimits.right))
            const y = camera.top + object.y - 5;

            this.game.ctx.fillStyle = 'white';
            this.game.ctx.fillRect(x, y, 5, 5);
        }

    }
}
