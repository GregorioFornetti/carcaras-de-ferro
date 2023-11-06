import { Enemy } from './Enemy.js';
import * as schema from "@colyseus/schema";

export class EnemySolitarioSchema extends schema.Schema {

}

schema.defineTypes(EnemySolitarioSchema, {
	x: "number",
	y: "number",
});

const MAPHEIGHT = 800;
const MAPWIDTH = 640;

export class EnemySolitario extends Enemy {

	static spawn(roomState) {	
		const enemy = new EnemySolitario(roomState);
		//console.log (this.game);
		enemy.enemyAttributes.y = -EnemySolitario.HEIGHT/2;
		enemy.enemyAttributes.x = Math.floor(Math.random() * (MAPWIDTH - EnemySolitario.WIDTH)) + EnemySolitario.WIDTH/2;
		
		return enemy;
	}
	
	static get HEIGHT () {return 32;}
	static get WIDTH () {return 32;}
	
	constructor(roomState) {
		super();
		this.init(roomState.enemiesSolitarioSchema, EnemySolitarioSchema);
		this.speed = 50;
	}
	
	update(deltaTime) {
		this.enemyAttributes.y += this.speed * (deltaTime / 1000);
		
		if (this.enemyAttributes.y > MAPHEIGHT + EnemySolitario.HEIGHT / 2)
			this.destroy();
	}
}
