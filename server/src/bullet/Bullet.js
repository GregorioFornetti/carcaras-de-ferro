import * as schema from "@colyseus/schema"

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
})

export class Bullet {
  constructor(roomState, bulletSpeed,bulletSpeedX=0,bulletSpeedY=0) {
    this.init(roomState.bulletSchema, BulletSchema, 5)
    this.speed = bulletSpeed
    this.bulletSpeedX = bulletSpeedX
    if (bulletSpeedX !== 0) {
      this.speed = bulletSpeedY
    }
  }

  static spawn(roomState, player, bulletSpeed, sessionId,bulletSpeedX=0,bulletSpeedY=0) {
    const bullet = new Bullet(roomState, bulletSpeed,bulletSpeedX,bulletSpeedY)
    bullet.bulletAttributes.x = player.x
    bullet.bulletAttributes.y = player.y - 20
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
    this.bulletAttributes.x -= this.bulletSpeedX

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
