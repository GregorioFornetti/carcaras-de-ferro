import { GAME_HEIGHT } from "../constants.js";
import { enemyExplosionAnimation, enemyDamageAnimation} from "../animations/animation.js";
export function EnemySuperTanqueOnAdd(enemy, id) {
	
	let tank = this.physics.add.image(0, 0, 'tile_0120');
	let turret = this.physics.add.image(0, 0, 'tile_0017');
	let health = enemy.health;

	this.enemiesEntities[id] = this.add.container(enemy.x, enemy.y, [tank, turret]);
	
	enemy.onChange(() => {
		this.enemiesEntities[id].setData('serverX', enemy.x);
		this.enemiesEntities[id].setData('serverY', enemy.y);
		this.enemiesEntities[id].setData('serverHealth', enemy.health);
		
		if (!isNaN(enemy.angle))
			this.enemiesEntities[id].list[1].angle = enemy.angle + 90;
		if(enemy.health != health) {
				health = enemy.health;
				enemyDamageAnimation(this, this.enemiesEntities[id].list[0]);
				enemyDamageAnimation(this, this.enemiesEntities[id].list[1]);
		}
	})
}

export function EnemySuperTanqueOnRemove(enemy, id) {
	enemyExplosionAnimation(this, enemy, id);
	this.enemiesEntities[id].destroy();
	delete this.enemiesEntities[id];
}
