import { GAME_HEIGHT, GAME_WIDTH } from "../constants.js";
import { enemyExplosionAnimation, enemyDamageAnimation} from "../animations/animation.js";

export function EnemyCruzadorOnAdd(enemy, id) {
    this.enemiesEntities[id] = this.physics.add.sprite(enemy.x, enemy.y, 'cruzador');
    this.enemiesEntities[id].angle = enemy.angle;
    let health = enemy.health;

    enemy.onChange(() => {
        this.enemiesEntities[id].setData('serverX', enemy.x);
		this.enemiesEntities[id].setData('serverY', enemy.y);
        this.enemiesEntities[id].setData('serverHealth', enemy.health);
        if(enemy.health != health) {
			health = enemy.health;
			enemyDamageAnimation(this, this.enemiesEntities[id]);
		}
    })
}


export function EnemyCruzadorOnRemove(enemy, id) {
	enemyExplosionAnimation(this, enemy, id);
    this.enemiesEntities[id].destroy();
    delete this.enemiesEntities[id];
}