import * as schema from "@colyseus/schema"
import { Bullet, BulletSchema } from "../bullet/Bullet.js"
import {Bomba } from "../bomba/Bomba.js"
import {GAME_HEIGHT, GAME_WIDTH, DEBUG_IMMORTAL, NUM_BOMBS, HEALTH,PLAYER_SPEED,
  PLAYER_WIDTH,PLAYER_HEIGHT,PLAYER_IMMORTAL_TIMER} from "../../constants.js"

export class PlayerSchema extends schema.Schema {
  constructor() {
    super()

    this.x = 50
    this.y = 50
    this.nBombas = NUM_BOMBS
    this.score = 0
    this.immortal = false | DEBUG_IMMORTAL
    this.health = HEALTH
  }
}

schema.defineTypes(PlayerSchema, {
  x: "number",
  y: "number",
  nBombas: "number",
  immortal: "boolean",
  health: "number",
  score: "number",
})

export class Player {
  constructor(roomState, sessionId) {
    this.init(roomState.playersSchema, PlayerSchema, sessionId)
    this.state = roomState
  }

  init(playersState, PlayerSchema, sessionId) {
    this.playerAtributes = new PlayerSchema()
    this.playersState = playersState
    this.id = sessionId
    this.playersState.set(this.id, this.playerAtributes)

    this.movement = {
      up: false, 
      down: false, 
      left: false, 
      right: false,
    }
    this.width = PLAYER_WIDTH
    this.height = PLAYER_HEIGHT
    this.dead = false
    this.speed = PLAYER_SPEED
  }

  static spawn(roomState, sessionId, spawnX=50, spawnY=50) {
    const player = new Player(roomState, sessionId)
    player.playerAtributes.x = spawnX
    player.playerAtributes.y = spawnY
    return player
  }

  fire() {
    if(this.dead) return undefined
    const bullet = new BulletSchema()
    bullet.x = this.playerAtributes.x
    bullet.y = this.playerAtributes.y - 20
    bullet.speed = 5
    bullet.destroyed = false
    let newBullet = Bullet.spawn(this.state, this.playerAtributes, this.id, 0, bullet.speed, 0, -6)
    return newBullet
  }

  nuke() {
    if (this.dead) return undefined
    if (this.playerAtributes.nBombas > 0) {
      this.playerAtributes.nBombas--
      return Bomba.spawn(this.state, this.playerAtributes, this.id)
    }
  }
  // Definição de dano de player. O retorno indica se o jogador perdeu vida (não, se estiver immortal)
  hit(hitdamage=1) {
    if (this.dead || this.playerAtributes.immortal) return false
    this.playerAtributes.immortal = true
    this.playerAtributes.health -= hitdamage
    setTimeout(() => {
      this.playerAtributes.immortal = false
    }, PLAYER_IMMORTAL_TIMER * 1000)
    if (this.playerAtributes.health === 0) {
      this.dead = true
    }
    return true
  }

  setMovement(movementType, value) {
    this.movement[movementType] = value
  }

  update(deltaTime) {
    if (this.dead) return

    if (this.movement.left) {
      this.playerAtributes.x -= this.speed * (deltaTime / 1000);
    } else if (this.movement.right) {
      this.playerAtributes.x += this.speed * (deltaTime / 1000);
    }
    if (this.movement.up) { 
      this.playerAtributes.y -= this.speed * (deltaTime / 1000); 
    } else if (this.movement.down) {
      this.playerAtributes.y += this.speed * (deltaTime / 1000);
    }
    this.checkBounds()
  }

  checkBounds() {
    const MIN_X = 0
    const MAX_X = GAME_WIDTH
    const MIN_Y = 0
    const MAX_Y = GAME_HEIGHT
    const MARGIN = 22

    if (this.movement.left) {
      this.playerAtributes.x = Math.max(this.playerAtributes.x - this.speed, MIN_X+MARGIN)
    } else if (this.movement.right) {
      this.playerAtributes.x = Math.min(this.playerAtributes.x + this.speed, MAX_X-MARGIN)
    }
    if (this.movement.up) { 
      this.playerAtributes.y = Math.max(this.playerAtributes.y - this.speed, MIN_Y+MARGIN)
    } else if (this.movement.down) { 
      this.playerAtributes.y = Math.min(this.playerAtributes.y + this.speed, MAX_Y-MARGIN)
    }
  }
}
