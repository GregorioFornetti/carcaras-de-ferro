import * as schema from "@colyseus/schema";

export class BackgroundSchema extends schema.Schema {
    constructor() {
        super();
        this.scrollY = 0;
    }
}

schema.defineTypes(BackgroundSchema, {
    scrollY: "number",
});