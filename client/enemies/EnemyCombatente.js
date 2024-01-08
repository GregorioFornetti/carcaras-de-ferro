import { enemyExplosionAnimation, enemyDamageAnimation} from "../animations/animation.js";

export function EnemyCombatenteOnAdd(enemy, id) {
	this.enemiesEntities[id] = this.physics.add.sprite(enemy.x, enemy.y, 'ship_0015');
	this.physics.add.existing(this.enemiesEntities[id]);
	let health = enemy.health;
	enemy.onChange(() => {
		this.enemiesEntities[id].setData('serverX', enemy.x);
		this.enemiesEntities[id].setData('serverY', enemy.y);
		if(enemy.health != health) {
			health = enemy.health;
			enemyDamageAnimation(this, this.enemiesEntities[id]);
		}
		this.enemiesEntities[id].setData('serverHealth', enemy.health);
	})
}

export function EnemyCombatenteOnRemove(enemy, id) {	
	enemyExplosionAnimation(this, enemy, id);
	this.enemiesEntities[id].destroy();
	delete this.enemiesEntities[id];
}
