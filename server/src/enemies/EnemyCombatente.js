import { Enemy } from './Enemy.js';
import * as schema from "@colyseus/schema";

export class EnemyCombatenteSchema extends schema.Schema {

}

schema.defineTypes(EnemyCombatenteSchema, {
	x: "number",
	y: "number",
	xInit: "number",
	yFinal: "number",
});

const MAPHEIGHT = 800;
const MAPWIDTH = 640;

export class EnemyCombatente extends Enemy {
	
	static spawn(roomState) {	
		const enemy = new EnemyCombatente(roomState);
		enemy.enemyAttributes.y = -EnemyCombatente.HEIGHT/2;
		
		let r = Math.random();
		
		if (r < 0.60) {
			enemy.enemyAttributes.yFinal = MAPHEIGHT * (Math.random() * (EnemyCombatente.POSICAO_PARADA_INTERMEDIARIA1 - EnemyCombatente.POSICAO_PARADA_MINIMA) + EnemyCombatente.POSICAO_PARADA_MINIMA);
		} else if (r < 0.9) {
			enemy.enemyAttributes.yFinal = MAPHEIGHT * (Math.random() * (EnemyCombatente.POSICAO_PARADA_INTERMEDIARIA2 - EnemyCombatente.POSICAO_PARADA_INTERMEDIARIA1) + EnemyCombatente.POSICAO_PARADA_INTERMEDIARIA1);
		} else {
			enemy.enemyAttributes.yFinal = MAPHEIGHT * (Math.random() * (EnemyCombatente.POSICAO_PARADA_MAXIMA - EnemyCombatente.POSICAO_PARADA_INTERMEDIARIA2) + EnemyCombatente.POSICAO_PARADA_INTERMEDIARIA2);
		}
		
		console.log (enemy.enemyAttributes.yFinal);
		
		enemy.enemyAttributes.x = Math.floor(Math.random() * (MAPWIDTH - EnemyCombatente.WIDTH - MAPWIDTH * EnemyCombatente.TAMANHO_MOVIMENTO_HORIZONTAL)) + EnemyCombatente.WIDTH/2;
		enemy.enemyAttributes.xInit = enemy.enemyAttributes.x;
		
		return enemy;
	}
	
	static get TAMANHO_MOVIMENTO_HORIZONTAL() {return 0.2};
	static get POSICAO_PARADA_MINIMA() {return 0.1};
	static get POSICAO_PARADA_INTERMEDIARIA1() {return 0.3};
	static get POSICAO_PARADA_INTERMEDIARIA2() {return 0.5};
	static get POSICAO_PARADA_MAXIMA() {return 0.7};
	
	
	static get HEIGHT () {return 32;}
	static get WIDTH () {return 32;}
	
	constructor(roomState) {
		super();
		this.init(roomState.enemiesCombatenteSchema, EnemyCombatenteSchema);
		this.verticalSpeed = 50;
		this.state = 1;
	}
	
	update(deltaTime) {
		switch (this.state) {
			case 1:
				this.enemyAttributes.y += this.verticalSpeed * (deltaTime / 1000);
				if (Math.round(this.enemyAttributes.y) == Math.round(this.enemyAttributes.yFinal))
					this.state = 2;
				break;
			case 2:
				
				
				
				break;
			default:
				break;
		}
	}	
}
