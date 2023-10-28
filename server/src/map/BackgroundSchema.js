import * as schema from "@colyseus/schema";

export class BackgroundSchema extends schema.Schema {
    constructor() {
        this.positionY = 1;
    }
}
schema.defineTypes(BackgroundSchema, {
    positionY: "number",
});
