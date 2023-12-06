import { Enemy } from './Enemy.js';
import * as schema from "@colyseus/schema";
import { GAME_HEIGHT, GAME_WIDTH, COMBATENTE_HEALTH, COMBATENTE_HEIGHT, COMBATENTE_INTERMEDIARY1_VERTICAL_POS, COMBATENTE_INTERMEDIARY2_VERTICAL_POS, COMBATENTE_MAX_VERTICAL_POS, COMBATENTE_MIN_VERTICAL_POS, COMBATENTE_VERTICAL_SPEED, COMBATENTE_WIDTH, COMBATENTE_SCORE, COMBATENTE_MAX_HORIZONTAL_SPEED, COMBATENTE_MIN_HORIZONTAL_SPEED, COMBATENTE_HORIZONTAL_MOVEMENT_SIZE } from '../../constants.js';

import {Bullet, BulletSchema} from '../bullet/bullet.js';

export class EnemyCombatenteSchema extends schema.Schema {

}

schema.defineTypes(EnemyCombatenteSchema, {
	x: "number",
	y: "number",
	xInit: "number",
	yFinal: "number",
	health: "number",
});

export class EnemyCombatente extends Enemy {
	
	static spawn(roomState) {	
		const enemy = new EnemyCombatente(roomState);
		enemy.enemyAttributes.y = -EnemyCombatente.HEIGHT/2;
		
		enemy.enemyAttributes. health = EnemyCombatente.MAX_HEALTH;
		
		let r = Math.random();
		
		if (r < 0.70) {
			enemy.enemyAttributes.yFinal = GAME_HEIGHT * (Math.random() * (EnemyCombatente.POSICAO_PARADA_INTERMEDIARIA1 - EnemyCombatente.POSICAO_PARADA_MINIMA) + EnemyCombatente.POSICAO_PARADA_MINIMA);
		} else if (r < 0.95) {
			enemy.enemyAttributes.yFinal = GAME_HEIGHT * (Math.random() * (EnemyCombatente.POSICAO_PARADA_INTERMEDIARIA2 - EnemyCombatente.POSICAO_PARADA_INTERMEDIARIA1) + EnemyCombatente.POSICAO_PARADA_INTERMEDIARIA1);
		} else {
			enemy.enemyAttributes.yFinal = GAME_HEIGHT * (Math.random() * (EnemyCombatente.POSICAO_PARADA_MAXIMA - EnemyCombatente.POSICAO_PARADA_INTERMEDIARIA2) + EnemyCombatente.POSICAO_PARADA_INTERMEDIARIA2);
		}
		
		
		
		enemy.enemyAttributes.x = Math.floor(Math.random() * (GAME_WIDTH - EnemyCombatente.WIDTH - 2*(EnemyCombatente.TAMANHO_MOVIMENTO_HORIZONTAL))) + EnemyCombatente.WIDTH/2 + EnemyCombatente.TAMANHO_MOVIMENTO_HORIZONTAL;
		
		//DEBUGING
		//enemy.enemyAttributes.x = Math.floor(1 * (GAME_WIDTH - EnemyCombatente.WIDTH - 2*(GAME_WIDTH * EnemyCombatente.TAMANHO_MOVIMENTO_HORIZONTAL))) + EnemyCombatente.WIDTH/2 + GAME_WIDTH * EnemyCombatente.TAMANHO_MOVIMENTO_HORIZONTAL;
		enemy.enemyAttributes.xInit = enemy.enemyAttributes.x;
		
		return [enemy];
	}
	
	static get VELOCIDADE_HORIZONTAL_MAXIMA() {return COMBATENTE_MAX_HORIZONTAL_SPEED};
	static get VELOCIDADE_HORIZONTAL_MINIMA() {return COMBATENTE_MIN_HORIZONTAL_SPEED};
	
	static get TAMANHO_MOVIMENTO_HORIZONTAL() {return COMBATENTE_HORIZONTAL_MOVEMENT_SIZE};
	static get POSICAO_PARADA_MINIMA() {return COMBATENTE_MIN_VERTICAL_POS};
	static get POSICAO_PARADA_INTERMEDIARIA1() {return COMBATENTE_INTERMEDIARY1_VERTICAL_POS};
	static get POSICAO_PARADA_INTERMEDIARIA2() {return COMBATENTE_INTERMEDIARY2_VERTICAL_POS};
	static get POSICAO_PARADA_MAXIMA() {return COMBATENTE_MAX_VERTICAL_POS};
	
	static get MAX_HEALTH() {return 4};
	static get SCORE() {return 400};
	
	static get TEMPO_MEIO_PONTO() {return 3};
	
	
	static get HEIGHT () {return COMBATENTE_HEIGHT;}
	static get WIDTH () {return COMBATENTE_WIDTH;}
	static get MIN_SHOOT_TIME() {return 0.5;}
	static get MAX_SHOOT_TIME() {return 2;}
	
	constructor(roomState) {
		super();
		this.room = roomState
		this.init(roomState.enemiesCombatenteSchema, EnemyCombatenteSchema);
		this.verticalSpeed = COMBATENTE_VERTICAL_SPEED;
		this.health = COMBATENTE_HEALTH;
		this.score = COMBATENTE_SCORE;
		if (Math.random() < 0.5)
			this.horizontalSpeed = -EnemyCombatente.VELOCIDADE_HORIZONTAL_MAXIMA;
		else
			this.horizontalSpeed = EnemyCombatente.VELOCIDADE_HORIZONTAL_MAXIMA;
		
		this.timerBullet = Math.random() * (EnemyCombatente.MAX_SHOOT_TIME - EnemyCombatente.MIN_SHOOT_TIME) + EnemyCombatente.MIN_SHOOT_TIME;
		
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
				this.horizontalSpeed = (EnemyCombatente.VELOCIDADE_HORIZONTAL_MAXIMA - (EnemyCombatente.VELOCIDADE_HORIZONTAL_MAXIMA - EnemyCombatente.VELOCIDADE_HORIZONTAL_MINIMA) * Math.abs((this.enemyAttributes.xInit - this.enemyAttributes.x) / EnemyCombatente.TAMANHO_MOVIMENTO_HORIZONTAL)) * Math.sign(this.horizontalSpeed);
				
				if (	(this.enemyAttributes.x >= (this.enemyAttributes.xInit + EnemyCombatente.TAMANHO_MOVIMENTO_HORIZONTAL)) ||
						(this.enemyAttributes.x <= (this.enemyAttributes.xInit - EnemyCombatente.TAMANHO_MOVIMENTO_HORIZONTAL)))
					this.horizontalSpeed *= -1;
				
				this.enemyAttributes.x += this.horizontalSpeed * (deltaTime / 1000);
				
				if (this.timerBullet <= 0) {
					
					const pos = {
						x: this.enemyAttributes.x,
						y: this.enemyAttributes.y + 40,
					}
					
					this.timerBullet = Math.random() * (EnemyCombatente.MAX_SHOOT_TIME - EnemyCombatente.MIN_SHOOT_TIME) + EnemyCombatente.MIN_SHOOT_TIME;
					return {
						'action': 'SHOOT',
						'angle': 270,
						'speedY': 5,
						'speedX': 0,
						'offsetX': 0,
						'offsetY': 20,
						'size': 1,
						'entity': this.enemyAttributes,
					};
				} else {
					this.timerBullet -= deltaTime / 1000;
				}
				
				break;
			default:
				break;
		}
	}
}
