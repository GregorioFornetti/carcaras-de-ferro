import * as schema from "@colyseus/schema"

const speedY = 1
const speedTamanho = 1
const tamanhoBomba = 30


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
    this.destroyed = false
  }

  static spawn(roomState, player) {
    const bomba = new Bomba(roomState)
    bomba.bombaAttributes.x = player.x
    bomba.bombaAttributes.y = player.y
    bomba.bombaAttributes.tamanho = tamanhoBomba

    return bomba
  }

  update(deltaTime) {
    
    this.bombaAttributes.y += speedY
    this.bombaAttributes.tamanho -= speedTamanho
    
  }

  destroy() {
    if (this.destroyed){
      return
    }
      
    this.bombaState.delete(this.id.toString())
    this.destroyed = true
    
  }

}