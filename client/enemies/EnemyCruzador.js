import { GAME_HEIGHT, GAME_WIDTH } from "../constants.js";
import { enemyExplosionAnimation, enemyDamageAnimation} from "../animations/animation.js";

export function EnemyCruzadorOnAdd(enemy, id) {
    this.enemiesEntities[id] = this.physics.add.sprite(enemy.x, enemy.y, 'cruzador');
    this.enemiesEntities[id].angle = enemy.angle;

    enemy.onChange(() => {
        this.enemiesEntities[id].setData('serverX', enemy.x);
		this.enemiesEntities[id].setData('serverY', enemy.y);
    })
}


export function EnemyCruzadorOnRemove(enemy, id) {
	enemyExplosionAnimation(this, enemy, id);
    this.enemiesEntities[id].destroy();
    delete this.enemiesEntities[id];
}