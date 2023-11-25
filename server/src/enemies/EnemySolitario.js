import { Enemy } from './Enemy.js';
import * as schema from "@colyseus/schema";
import { GAME_HEIGHT, GAME_WIDTH } from '../../constants.js';

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
		enemy.enemyAttributes.y = -EnemySolitario.HEIGHT/2;
		enemy.enemyAttributes.x = Math.floor(Math.random() * (GAME_WIDTH - EnemySolitario.WIDTH)) + EnemySolitario.WIDTH/2;
		
		//DEBUGING
		//enemy.enemyAttributes.x = Math.floor(1 * (GAME_WIDTH - EnemySolitario.WIDTH)) + EnemySolitario.WIDTH/2;
		
		return enemy;
	}
	
	static get HEIGHT () {return 32;}
	static get WIDTH () {return 32;}
	
	constructor(roomState) {
		super();
		this.init(roomState.enemiesSolitarioSchema, EnemySolitarioSchema);
		this.speed = 50;
		this.width = 16;
		this.height = 16;
	}
	
	update(deltaTime) {
		this.enemyAttributes.y += this.speed * (deltaTime / 1000);
		
		if (this.enemyAttributes.y > GAME_HEIGHT + EnemySolitario.HEIGHT / 2)
			this.destroy();
	}
}
