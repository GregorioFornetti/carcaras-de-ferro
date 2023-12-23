import { GAME_HEIGHT } from "../constants.js";
import { explosionAnimation } from "../animations/playerAnimation.js";

export function EnemyPatrulheirosOnAdd(enemy, id) {
	this.enemiesEntities[id] = this.physics.add.sprite(enemy.x, enemy.y, 'ship_0023');
	this.physics.add.existing(this.enemiesEntities[id]);

	enemy.onChange(() => {
		this.enemiesEntities[id].setData('serverX', enemy.x);
		this.enemiesEntities[id].setData('serverY', enemy.y);
		//this.enemiesEntities[id].setData('serverY', enemy.health);
	})
}

export function EnemyPatrulheirosOnRemove(enemy, id) {
	//explosionAnimation(this, enemy, id);
	this.enemiesEntities[id].destroy();
	delete this.enemiesEntities[id];
}
