import { Enemy } from './Enemy.js';
import * as schema from "@colyseus/schema";
import { GAME_HEIGHT, GAME_WIDTH,SOLITARIO_HEALTH,SOLITARIO_SCORE,SOLITARIO_HEIGHT,SOLITARIO_WIDTH,SOLITARIO_SPEED } from '../../constants.js';

export class EnemySolitarioSchema extends schema.Schema {

}

schema.defineTypes(EnemySolitarioSchema, {
	x: "number",
	y: "number",
});

export class EnemySolitario extends Enemy {

	static spawn(roomState) {	
		const enemy = new EnemySolitario(roomState);
		//console.log (this.game);
		enemy.enemyAttributes.y = -SOLITARIO_HEIGHT/2;
		enemy.enemyAttributes.x = Math.floor(Math.random() * (GAME_WIDTH - SOLITARIO_WIDTH)) + SOLITARIO_WIDTH/2;
		
		//DEBUGING
		//enemy.enemyAttributes.x = Math.floor(1 * (GAME_WIDTH - EnemySolitario.WIDTH)) + EnemySolitario.WIDTH/2;
		
		return [enemy];
	}
		
	constructor(roomState) {
		super();
		this.init(roomState.enemiesSolitarioSchema, EnemySolitarioSchema);
		this.health = SOLITARIO_HEALTH;
		this.score = SOLITARIO_SCORE;
		this.speed = SOLITARIO_SPEED;
		this.width = SOLITARIO_WIDTH;
		this.height = SOLITARIO_HEIGHT;
	}
	
	update(deltaTime) {
		this.enemyAttributes.y += this.speed * (deltaTime / 1000);
		
		if (this.enemyAttributes.y > (GAME_HEIGHT + SOLITARIO_HEIGHT) / 2)
			this.destroy();
	}
}
