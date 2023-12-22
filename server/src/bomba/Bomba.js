import * as schema from "@colyseus/schema"
import {GAME_WIDTH, GAME_HEIGHT} from '../../constants.js';

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
  constructor(roomState, playerId) {
    this.init(roomState.bombaSchema, BombaSchema, playerId)
  }

  init(bombaState, BombaSchema, playerId) {
    this.bombaAttributes = new BombaSchema()
    this.bombaState = bombaState
    this.id = bombaId++
    this.bombaState.set(this.id, this.bombaAttributes)
    this.destroyed = false
    this.owner = playerId
    this.timeToExplode = 2  // Em segundos
  }

  static spawn(roomState, player, playerId) {
    const bomba = new Bomba(roomState, playerId)
    bomba.bombaAttributes.x = player.x
    bomba.bombaAttributes.y = player.y
    bomba.bombaAttributes.tamanho = tamanhoBomba

    return bomba
  }

  update(deltaTime) {
    
    this.timeToExplode -= deltaTime / 1000
    this.bombaAttributes.y += speedY
    if (this.bombaAttributes.y > GAME_HEIGHT)
      this.bombaAttributes.y = GAME_HEIGHT
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