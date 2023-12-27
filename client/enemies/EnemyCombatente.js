import { GAME_HEIGHT } from "../constants.js";
import { enemyExplosionAnimation } from "../animations/animation.js";

export function EnemyCombatenteOnAdd(enemy, id) {
	this.enemiesEntities[id] = this.physics.add.sprite(enemy.x, enemy.y, 'ship_0015');
	this.physics.add.existing(this.enemiesEntities[id]);

	enemy.onChange(() => {
		this.enemiesEntities[id].setData('serverX', enemy.x);
		this.enemiesEntities[id].setData('serverY', enemy.y);
		this.enemiesEntities[id].setData('serverHealth', enemy.health);
	})
}

export function EnemyCombatenteOnRemove(enemy, id) {	
	enemyExplosionAnimation(this, enemy, id);
	this.enemiesEntities[id].destroy();
	delete this.enemiesEntities[id];
}
