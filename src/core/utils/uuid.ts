import { randomUUID } from "crypto";

export class UUID {
    private generatedUuid: string;
    private static uuids: string[];

    constructor() {
        let uuid = randomUUID({ disableEntropyCache: true });
        while (UUID.uuids.includes(uuid)) {
            uuid = randomUUID({ disableEntropyCache: true });
        }
        this.generatedUuid = uuid;
    }

    get value() {
        return this.generatedUuid;
    }
}
