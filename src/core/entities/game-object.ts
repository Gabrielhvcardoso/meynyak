import { Game } from "../game";
import { EntityManager } from "../managers/entity-manager";
import { UUID } from "../utils/uuid";

export abstract class GameObject {
    constructor(protected game: Game,
                public id = new UUID().value) {

        EntityManager.set(this);
    }

    /** Update method called on tick, before draw */
    public abstract update(): void;
}
