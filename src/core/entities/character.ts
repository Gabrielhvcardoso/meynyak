import { Game } from "../game";
import { Moveable, MoveableConfig } from "./moveable";

export interface CharacterConfig extends MoveableConfig {
    health: number;
    armor: number;
    force: number;
}

export abstract class Character extends Moveable {

    public health: number;
    public armor: number;
    public force: number;

    public maxHealth: number;
    public maxArmor: number;
    public maxForce: number;

    private healthInterval: NodeJS.Timer | undefined;
    private armorInterval: NodeJS.Timer | undefined;

    constructor(game: Game, { health, armor, force, ...config }: CharacterConfig) {
        super(game, config);
        this.health = health;
        this.armor = armor;
        this.force = force;
        this.maxHealth = health;
        this.maxArmor = armor;
        this.maxForce = force;

        this.startDefenseRestore();
    }

    startDefenseRestore(): void {
        if (this.healthInterval) clearInterval(this.healthInterval);
        if (this.armorInterval) clearInterval(this.armorInterval);

        this.healthInterval = setInterval(() => {
            if (!this.running && this.armor === this.maxArmor) {
                this.health = Math.min(this.maxHealth, this.health += 10);
            }
        }, 5000);

        this.armorInterval = setInterval(() => {
            if (!this.running) {
                this.armor = Math.min(this.maxArmor, this.armor += 15);
            }
        }, 2000);
    }

}
