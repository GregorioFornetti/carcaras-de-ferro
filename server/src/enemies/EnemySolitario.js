import { Enemy } from './Enemy.js';
import * as schema from "@colyseus/schema";

export class EnemySolitarioSchema extends schema.Schema {

}

schema.defineTypes(EnemySolitarioSchema, {
	x: "number",
	y: "number",
	//color: "number"
});

export class EnemySolitario extends Enemy {

	static spawn(roomState) {	
		const enemy = new EnemySolitario(roomState);
		enemy.enemyAttributes.y = -16;
		enemy.enemyAttributes.x = Math.floor(Math.random() * 608)+16;
		
		return enemy;
	}
	
	constructor(roomState) {
		super();
		this.init(roomState.enemiesSolitarioSchema, EnemySolitarioSchema);
		
		//this.enemyAttributes.color = 0;
	}
	
	update(deltaTime) {
		this.enemyAttributes.y += 25 * (deltaTime / 1000);
		
		if (this.enemyAttributes.y > 816)
			this.destroy();
		
	}	
}
