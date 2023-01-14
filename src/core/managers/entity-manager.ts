import { GameObject } from "../entities/game-object";

export class EntityManager {
    public static objects = new Map<string, GameObject>([]);

    /** Register a new object in Map, or update a existing one */
    public static set(object: GameObject): void {
        this.objects.set(object.id, object);
    }
}
