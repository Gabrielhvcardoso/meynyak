import { randomBytes } from "crypto";

export class UUID {
    private generatedUuid: string;
    private static uuids: string[] = [];

    constructor() {
        let uuid = randomBytes(16).toString('hex');
        while (UUID.uuids.includes(uuid)) {
            uuid = randomBytes(16).toString('hex');
        }
        this.generatedUuid = uuid;
    }

    get value() {
        return this.generatedUuid;
    }
}
