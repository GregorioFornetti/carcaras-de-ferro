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
    this.destroyed = false
  }

  static spawn(roomState, player) {
    const bomba = new Bomba(roomState)
    bomba.bombaAttributes.x = player.x
    bomba.bombaAttributes.y = player.y
    bomba.bombaAttributes.tamanho = 30 //alterar dps

    return bomba
  }

  update(deltaTime) {
    //alterar dps
    this.bombaAttributes.y += 1
    this.bombaAttributes.tamanho -= 1
    if ( this.bombaAttributes.tamanho < 5) {
      //this.destroy()
      
    }
    
  }

  destroy() {
    if (this.destroyed){
      return
    }
      
    this.bombaState.delete(this.id.toString())
    this.destroyed = true
    
  }

}