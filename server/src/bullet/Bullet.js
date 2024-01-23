import * as schema from "@colyseus/schema"
import { GAME_HEIGHT, GAME_WIDTH } from "../../constants.js"

let bulletId = 0

export class BulletSchema extends schema.Schema {
  constructor() {
    super()

    this.x = 50
    this.y = 50
    this.destroyed = false
    this.owner = ""
    this.size = 1
  }
}

schema.defineTypes(BulletSchema, {
  x: "number",
  y: "number",
  destroyed: "boolean",
  size: "number",
  owner: "string",
  rotation: "number",
})

export class Bullet {
  constructor(roomState, bulletSpeedX=0, bulletSpeedY=0) {
    this.init(roomState.bulletSchema, BulletSchema, 5)

    this.bulletSpeedX = bulletSpeedX
    this.bulletSpeedY = bulletSpeedY
  }

  static spawn(roomState, entity, sessionId, bulletSpeedX=0, bulletSpeedY=0, offsetX=0, offsetY=0, rotation=0) {
    const bullet = new Bullet(roomState, bulletSpeedX, bulletSpeedY)
    bullet.bulletAttributes.x = entity.x + offsetX
    bullet.bulletAttributes.y = entity.y + offsetY
    bullet.bulletAttributes.rotation = rotation
    bullet.owner = sessionId

    return bullet
	
  }

  init(bulletState, BulletSchema) {
    this.bulletAttributes = new BulletSchema()
    this.bulletState = bulletState
    this.id = bulletId++
    this.bulletState.set(this.id, this.bulletAttributes)
    this.destroyed = false
    this.width = 10
    this.height = 16
  }

  update(deltaTime) {
    this.bulletAttributes.y -= this.bulletSpeedY
    this.bulletAttributes.x -= this.bulletSpeedX


    if (
      this.bulletAttributes.x > GAME_WIDTH + this.height ||  // Saiu pela direita
      this.bulletAttributes.x < 0 - this.height ||  // Saiu pela esquerda
      this.bulletAttributes.y > GAME_HEIGHT + this.height ||  // Saiu por baixo
      this.bulletAttributes.y < 0 - this.height  // Saiu por cima
    ) {
      this.destroy()
    }
  }

  destroy() {
    if (this.destroyed) {
      return
    }

    this.bulletState.delete(this.id.toString())
    
    this.destroyed = true
  }
}
