import { bulletLight } from "../animations/animation.js";

export function BulletOnAdd(bullet, id) {
	if (bullet.style == 0)
		this.bulletsEntities[id] = this.physics.add.sprite(
			bullet.x,
			bullet.y,
			"bullet"
		)
	else
		this.bulletsEntities[id] = this.physics.add.sprite(
			bullet.x,
			bullet.y,
			"bullet2"
		)

	this.bulletsEntities[id].angle = bullet.rotation
	
	if (bullet.owner !== undefined && bullet.owner == "SERVER") {
		this.somDisparoInimigo.play();
	} else {
		this.somDisparoJogador.play();
		bulletLight(this, bullet, id);
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