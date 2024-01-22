import { GAME_HEIGHT, GAME_WIDTH } from "../constants.js";
import { enemyExplosionAnimation, enemyDamageAnimation} from "../animations/animation.js";

export function EnemyCacadorOnAdd(enemy, id) {
    this.enemiesEntities[id] = this.physics.add.sprite(enemy.x, enemy.y, 'ship_19');
    this.enemiesEntities[id].angle = enemy.angle;

    enemy.onChange(() => {
        this.enemiesEntities[id].setData('serverX', enemy.x);
		this.enemiesEntities[id].setData('serverY', enemy.y);
		this.enemiesEntities[id].angle = enemy.angle;
    })
}


export function EnemyCacadorOnRemove(enemy, id) {
	enemyExplosionAnimation(this, enemy, id);
    this.enemiesEntities[id].destroy();
    delete this.enemiesEntities[id];
}