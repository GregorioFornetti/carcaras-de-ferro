export function BulletOnAdd(bullet, id) {
	this.bulletsEntities[id] = this.physics.add.sprite(
		bullet.x,
		bullet.y,
		"bullet"
	)

	this.bulletsEntities[id].angle = bullet.rotation
	
	if (bullet.owner !== undefined && bullet.owner == "SERVER") {
		this.somDisparoInimigo.play();
	} else {
		this.somDisparoJogador.play();
	}
	this.bulletsEntities[id].setScale(bullet.size)

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
