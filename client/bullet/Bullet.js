export function BulletOnAdd(bullet, id) {
  this.bulletsEntities[id] = this.physics.add.sprite(
    bullet.x,
    bullet.y,
    "bullet"
  )
  this.somDisparoJogador.play();

  this.bulletsEntities[id].setData('owner', bullet.owner);
  this.bulletsEntities[id].setData('sent', false);
  bullet.onChange(() => {
    this.bulletsEntities[id].setData('serverX', bullet.x);
		this.bulletsEntities[id].setData('serverY', bullet.y);
  })
}

export function BulletOnRemove(bullet, id) {
  const entity = this.bulletsEntities[id]

  if (entity) {
    delete this.bulletsEntities[id]

    entity.destroy()
  }
}
