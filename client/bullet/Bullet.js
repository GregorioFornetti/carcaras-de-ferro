export function BulletOnAdd(bullet, id) {
  this.bulletsEntities[id] = this.physics.add.sprite(
    bullet.x,
    bullet.y,
    "bullet"
  )

  bullet.onChange(() => {
    this.bulletsEntities[id].x = bullet.x
    this.bulletsEntities[id].y = bullet.y
  })
}

export function BulletOnRemove(bullet, id) {
  const entity = this.bulletsEntities[id]

  if (entity) {
    delete this.bulletsEntities[id]

    entity.destroy()
  }
}
