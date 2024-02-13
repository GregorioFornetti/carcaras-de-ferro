import * as schema from "@colyseus/schema"
import {GAME_WIDTH, GAME_HEIGHT, BOMB_SPEED_Y,BOMB_SHRINK_SPEED,BOMB_INIT_SIZE,BOMB_DETONATE_TIMER} from '../../constants.js';

let bombaId = 0

export class BombaSchema extends schema.Schema {
  
}

schema.defineTypes(BombaSchema, {
  x: "number",
  y: "number",
  tamanho: "number",
  owner: "string"
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
    this.timeToExplode = BOMB_DETONATE_TIMER  
  }

  static spawn(roomState, player, playerId) {
    const bomba = new Bomba(roomState, playerId)
    bomba.bombaAttributes.x = player.x
    bomba.bombaAttributes.y = player.y
    bomba.bombaAttributes.tamanho = BOMB_INIT_SIZE
    bomba.bombaAttributes.owner = playerId

    return bomba
  }

  update(deltaTime) {
    
    this.bombaAttributes.tamanho -= BOMB_SHRINK_SPEED
    this.timeToExplode -= deltaTime / 1000
    this.bombaAttributes.y += BOMB_SPEED_Y
    if (this.bombaAttributes.y > GAME_HEIGHT)
      this.bombaAttributes.y = GAME_HEIGHT
    
  }

  destroy() {
    if (this.destroyed){
      return
    }
      
    this.bombaState.delete(this.id.toString())
    this.destroyed = true
    
  }

}