import { Enemy } from './Enemy.js';
import * as schema from "@colyseus/schema";
import { GAME_HEIGHT, GAME_WIDTH, PATRULHEIRO_HEALTH, PATRULHEIRO_HEIGHT, PATRULHEIRO_SCORE, PATRULHEIRO_SPEED, PATRULHEIRO_WIDTH } from '../../constants.js';

export class EnemyPatrulheirosSchema extends schema.Schema {

}

schema.defineTypes(EnemyPatrulheirosSchema, {
	x: "number",
	y: "number",
    health: "number"
});

export class EnemyPatrulheiros extends Enemy {
	
	static spawn(roomState) {
		const enemy1 = new EnemyPatrulheiros(roomState);
		const enemy2 = new EnemyPatrulheiros(roomState);
		const enemy3 = new EnemyPatrulheiros(roomState);
		
		enemy1.enemyAttributes.y = -EnemyPatrulheiros.HEIGHT/2 - EnemyPatrulheiros.SEPARACAO_VERTICAL;
		enemy1.enemyAttributes.x = Math.floor(Math.random() * (GAME_WIDTH - 2*EnemyPatrulheiros.SEPARACAO_HORIZONTAL - EnemyPatrulheiros.WIDTH)) + EnemyPatrulheiros.WIDTH/2;
		
		//DEBUGING
		//enemy1.enemyAttributes.x = Math.floor(0 * (GAME_WIDTH - 2*EnemyPatrulheiros.SEPARACAO_HORIZONTAL - EnemyPatrulheiros.WIDTH)) + EnemyPatrulheiros.WIDTH/2;
		
		enemy2.enemyAttributes.y = enemy1.enemyAttributes.y + EnemyPatrulheiros.SEPARACAO_VERTICAL;
		enemy2.enemyAttributes.x = enemy1.enemyAttributes.x + EnemyPatrulheiros.SEPARACAO_HORIZONTAL;
		
		enemy3.enemyAttributes.y = enemy1.enemyAttributes.y;
		enemy3.enemyAttributes.x = enemy2.enemyAttributes.x + EnemyPatrulheiros.SEPARACAO_HORIZONTAL;
		
		return [enemy1, enemy2, enemy3];
	}
	
	static get HEIGHT () {return 32;}
	static get WIDTH () {return 32;}
	static get SEPARACAO_VERTICAL () {return 64;}
	static get SEPARACAO_HORIZONTAL () {return 48;}
	
	constructor(roomState) {
		super();
		this.init(roomState.enemiesPatrulheirosSchema, EnemyPatrulheirosSchema);
		this.health = PATRULHEIRO_HEALTH
		this.score = PATRULHEIRO_SCORE
		this.speed = PATRULHEIRO_SPEED;
		this.width = PATRULHEIRO_WIDTH;
		this.height = PATRULHEIRO_HEIGHT
	}
	
	update(deltaTime) {
		this.enemyAttributes.y += this.speed * (deltaTime / 1000);
		
		if (this.enemyAttributes.y > GAME_HEIGHT + EnemyPatrulheiros.HEIGHT / 2) {
			this.destroy();
		}
	}
}
