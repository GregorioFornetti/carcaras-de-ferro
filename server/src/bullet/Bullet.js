import * as schema from "@colyseus/schema"

let bulletId = 0

export class BulletSchema extends schema.Schema {
  constructor() {
    super()

    this.x = 50
    this.y = 50
    this.destroyed = false
  }
}

schema.defineTypes(BulletSchema, {
  x: "number",
  y: "number",
  destroyed: "boolean",
})

export class Bullet {
  constructor(roomState, bulletSpeed) {
    this.init(roomState.bulletSchema, BulletSchema, 5)
    this.speed = bulletSpeed
  }

  static spawn(roomState, player, bulletSpeed) {
    const bullet = new Bullet(roomState, bulletSpeed)
    bullet.bulletAttributes.x = player.x
    bullet.bulletAttributes.y = player.y - 20

    return bullet
  }

  init(bulletState, BulletSchema) {
    this.bulletAttributes = new BulletSchema()
    this.bulletState = bulletState
    this.id = bulletId++
    this.bulletState.set(this.id, this.bulletAttributes)
    this.destroyed = false
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
