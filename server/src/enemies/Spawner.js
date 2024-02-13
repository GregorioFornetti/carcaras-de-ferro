import { Enemy } from './Enemy.js';
import {SPAWNER_INIT_TIMER,SPAWN_WEIGHT_SOLITARIO,SPAWN_WEIGHT_PATRULHEIROS,
	SPAWN_WEIGHT_DESAVISADOS,SPAWN_WEIGHT_COMBATENTE,SPAWN_WEIGHT_FORTALEZA,
	SPAWN_WEIGHT_CACADOR,SPAWN_WEIGHT_CRUZADOR,SPAWN_WEIGHT_TANQUE,
	SPAWN_WEIGHT_SUPER_TANQUE,SPAWN_NUMBER_WEIGHTS} from "../../constants.js"

import { EnemySolitario } from "./EnemySolitario.js";
import { EnemyPatrulheiros } from "./EnemyPatrulheiros.js";
import { EnemyDesavisados } from "./EnemyDesavisados.js";
import { EnemyCombatente } from "./EnemyCombatente.js";
import { EnemyFortaleza } from './EnemyFortaleza.js';
import { EnemyCacador } from './EnemyCacador.js';
import { EnemyCruzador } from './EnemyCruzador.js';
import { EnemyTanque } from './EnemyTanque.js';
import { EnemySuperTanque } from './EnemySuperTanque.js';

export class Spawner {
	
	constructor(roomState) {
		this.room = roomState;
		
		this.enemies = [];
		
		this.enemies.push ({"enemy": EnemySolitario, "weight": SPAWN_WEIGHT_SOLITARIO});
		this.enemies.push ({"enemy": EnemyPatrulheiros, "weight": SPAWN_WEIGHT_PATRULHEIROS});
		this.enemies.push ({"enemy": EnemyDesavisados, "weight": SPAWN_WEIGHT_DESAVISADOS});
		this.enemies.push ({"enemy": EnemyCombatente, "weight": SPAWN_WEIGHT_COMBATENTE});
		this.enemies.push ({"enemy": EnemyFortaleza, "weight": SPAWN_WEIGHT_FORTALEZA});
		this.enemies.push ({"enemy": EnemyCacador, "weight": SPAWN_WEIGHT_CACADOR});
		this.enemies.push ({"enemy": EnemyCruzador, "weight": SPAWN_WEIGHT_CRUZADOR});
		this.enemies.push ({"enemy": EnemyTanque, "weight": SPAWN_WEIGHT_TANQUE});
		this.enemies.push ({"enemy": EnemySuperTanque, "weight": SPAWN_WEIGHT_SUPER_TANQUE});
		
		this.spawn_quantities_weights = SPAWN_NUMBER_WEIGHTS;
		
		this.timer = SPAWNER_INIT_TIMER;
	}
		
	update(deltaTime) {
		if (this.timer > 0) {
			this.timer -= deltaTime / 1000;
			return null;
		}
		
		this.timer = SPAWNER_INIT_TIMER;
		return this.spawn();
	}
	
	spawn () {
		let sum_spawn_weights = 0;
		for (let i in this.spawn_quantities_weights) {
			sum_spawn_weights += this.spawn_quantities_weights[i];
		}
		
		let random_spawn_quantities = Math.random();
		
		let qtd_enemies = 0;
		for (let i = 0, sum = 0; i < this.spawn_quantities_weights.length; i++) {
			sum += this.spawn_quantities_weights[i] / sum_spawn_weights;
			if (random_spawn_quantities <= sum) {
				qtd_enemies = i + 1;
				break;
			}
		}
		
		let sum_enemies_weights = 0;
		for (let i in this.enemies) {
			sum_enemies_weights += this.enemies[i].weight;
		}
		
		let spawned_enemies = [];
		
		for (let i = 0; i < qtd_enemies; i++) {
			let random_enemy_spawn = Math.random();
			
			for (let j = 0, sum = 0; j < this.enemies.length; j++) {
				sum += this.enemies[j].weight / sum_enemies_weights;
				if (random_enemy_spawn <= sum) {
					spawned_enemies = spawned_enemies.concat(this.enemies[j].enemy.spawn(this.room));
					break;
				}
			}
		}
		
		return spawned_enemies;
	}
}
