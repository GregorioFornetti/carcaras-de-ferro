import * as schema from "@colyseus/schema"

let bulletId = 0

export class BulletSchema extends schema.Schema {
  constructor() {
    super()

    this.x = 50
    this.y = 50
    this.destroyed = false
    this.owner = ""
  }
}

schema.defineTypes(BulletSchema, {
  x: "number",
  y: "number",
  destroyed: "boolean",
  owner: "string",
})

export class Bullet {
  constructor(roomState, bulletSpeed) {
    this.init(roomState.bulletSchema, BulletSchema, 5)
    this.speed = bulletSpeed
  }

  static spawn(roomState, entity, bulletSpeed, sessionId, offsetX, offsetY) {
	const bullet = new Bullet(roomState, bulletSpeed)
    bullet.bulletAttributes.x = entity.x + offsetX
    bullet.bulletAttributes.y = entity.y + offsetY
	bullet.bulletAttributes.owner = sessionId
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
    this.bulletAttributes.y -= this.speed

    if (this.bulletAttributes.y < -20) {
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
