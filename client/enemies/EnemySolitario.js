import { GAME_HEIGHT } from "../constants.js";
import { explosionAnimation } from "../animations/animation.js";

export function EnemySolitarioOnAdd(enemy, id) {
	this.enemiesEntities[id] = this.physics.add.sprite(enemy.x, enemy.y, 'ship_0022', 0);
	this.enemiesEntities[id].angle = 180
	this.physics.add.existing(this.enemiesEntities[id]);
	this.enemiesEntities[id].health = enemy.health;

	enemy.onChange(() => {
		this.enemiesEntities[id].setData('serverX', enemy.x);
		this.enemiesEntities[id].setData('serverY', enemy.y);
		this.enemiesEntities[id].setData('health', enemy.health);
	})
}

export function EnemySolitarioOnRemove(enemy, id) {
	explosionAnimation(this, enemy, id);
	this.enemiesEntities[id].destroy();
	delete this.enemiesEntities[id];
}
