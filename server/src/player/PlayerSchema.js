import * as schema from "@colyseus/schema"

export class PlayerSchema extends schema.Schema {
  constructor() {
    super()

    this.x = 50
    this.y = 50
  }
}

schema.defineTypes(PlayerSchema, {
  x: "number",
  y: "number",
})
