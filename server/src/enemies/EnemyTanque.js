import { Enemy } from './Enemy.js';
import * as schema from "@colyseus/schema";
import { GAME_HEIGHT, GAME_WIDTH, COMBATENTE_HEALTH, COMBATENTE_HEIGHT, COMBATENTE_INTERMEDIARY1_VERTICAL_POS, COMBATENTE_INTERMEDIARY2_VERTICAL_POS, COMBATENTE_MAX_VERTICAL_POS, COMBATENTE_MIN_VERTICAL_POS, COMBATENTE_VERTICAL_SPEED, COMBATENTE_WIDTH, COMBATENTE_SCORE, COMBATENTE_MAX_HORIZONTAL_SPEED, COMBATENTE_MIN_HORIZONTAL_SPEED, COMBATENTE_HORIZONTAL_MOVEMENT_SIZE } from '../../constants.js';


export class EnemyTanqueSchema extends schema.Schema {

}

schema.defineTypes(EnemyTanqueSchema, {
	x: "number",
	y: "number",
	angle: "number",
	health: "number",
});

export class EnemyTanque extends Enemy {
	
	static spawn(roomState) {	
		const enemy = new EnemyTanque(roomState);
		enemy.enemyAttributes.y = -EnemyTanque.HEIGHT/2;
		enemy.enemyAttributes.x = Math.round(Math.random() * 28) * GAME_WIDTH / 28;
		
		let iterator_obj = roomState.playersSchema.$items.entries();
		let shortestDistance = Number.POSITIVE_INFINITY;
		
		while (true) {
			let aux = iterator_obj.next();
			if (aux.done)
				break;
			aux = aux.value;
			
			if (Math.sqrt(Math.pow((enemy.enemyAttributes.x - aux[1].x), 2) + Math.pow((enemy.enemyAttributes.y - aux[1].y), 2)) < shortestDistance) {
				shortestDistance = Math.sqrt(Math.pow((enemy.enemyAttributes.x - aux[1].x), 2) + Math.pow((enemy.enemyAttributes.y - aux[1].y), 2));
				enemy.closestPlayer = aux[0];
			}
		}
		
		return [enemy];
	}
	
	static get MAX_HEALTH() {return 4};
	static get SCORE() {return 400};
	
	static get HEIGHT () {return 32;}
	static get WIDTH () {return 32;}
	static get MIN_SHOOT_TIME() {return 0.5;}
	static get MAX_SHOOT_TIME() {return 2;}
	
	constructor(roomState) {
		super();
		this.room = roomState
		this.init(roomState.enemiesTanqueSchema, EnemyTanqueSchema);
		this.verticalSpeed = 32;
		this.health = 3;
		this.score = 150;
		this.fireRate = 4;
		this.closestPlayer = null;
		this.timerBullet = 2;
	}
	
	update(deltaTime) {
		this.enemyAttributes.y += this.verticalSpeed * (deltaTime / 1000);
		
		this.verticalSpeed = this.room.bgSchema.speed * 61.5;
		
		const player = this.room.playersSchema.get(this.closestPlayer);
		this.enemyAttributes.angle = Math.atan2(this.enemyAttributes.y - player.y, this.enemyAttributes.x - player.x + 0.0001) * 180 / Math.PI;
		if (this.enemyAttributes.angle < 0)
			this.enemyAttributes.angle += 360;
		
		if (this.timerBullet <= 0) {
			
			//console.log (this.closestPlayer);
			let player = this.room.playersSchema.get(this.closestPlayer);
			
			this.angle = Math.atan2(this.enemyAttributes.y - player.y, this.enemyAttributes.x - player.x);
			//console.log (this.angle * 180 / Math.PI);
			
			this.timerBullet = 2;
			
			return {
				'action': 'SHOOT',
				'angle': this.enemyAttributes.angle,
				'speedY': 5 * Math.sin(this.angle),
				'speedX': 5 * Math.cos(this.angle),
				'offsetX': 0,
				'offsetY': 20,
				'size': 1,
				'entity': this.enemyAttributes,
			};
		} else {
			this.timerBullet -= deltaTime / 1000;
		}
	}
}
