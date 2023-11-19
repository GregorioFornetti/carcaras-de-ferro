import * as schema from "@colyseus/schema"

let bombaId = 0

export class BombaSchema extends schema.Schema {
  
}

schema.defineTypes(BombaSchema, {
  x: "number",
  y: "number",
  tamanho: "number",
})

export class Bomba {
  constructor(roomState) {
    this.init(roomState.bombaSchema, BombaSchema)
  }

  init(bombaState, BombaSchema) {
    this.bombaAttributes = new BombaSchema()
    this.bombaState = bombaState
    this.id = bombaId++
    this.bombaState.set(this.id, this.bombaAttributes)
  }

  static spawn(roomState, player) {
    const bomba = new Bomba(roomState)
    bomba.bombaAttributes.x = player.x
    bomba.bombaAttributes.y = player.y

    return bomba
  }

}