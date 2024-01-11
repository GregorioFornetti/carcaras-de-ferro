import { Enemy } from './Enemy.js';

import { EnemySolitario } from "./EnemySolitario.js";
import { EnemyPatrulheiros } from "./EnemyPatrulheiros.js";
import { EnemyDesavisados } from "./EnemyDesavisados.js";
import { EnemyCombatente } from "./EnemyCombatente.js";
import { EnemyFortaleza } from './EnemyFortaleza.js';
import { EnemyCacador } from './EnemyCacador.js';
import { EnemyCruzador } from './EnemyCruzador.js';

export class Spawner {
	
	constructor(roomState) {
		this.room = roomState;
		
		this.enemies = [];
		
		this.enemies.push ({"enemy": EnemySolitario, "weight": 4});
		this.enemies.push ({"enemy": EnemyPatrulheiros, "weight": 3});
		this.enemies.push ({"enemy": EnemyDesavisados, "weight": 2});
		this.enemies.push ({"enemy": EnemyCombatente, "weight": 1});
		this.enemies.push ({"enemy": EnemyFortaleza, "weight": 1});
		this.enemies.push ({"enemy": EnemyCacador, "weight": 1});
		this.enemies.push ({"enemy": EnemyCruzador, "weight": 1});
		
		this.spawn_quantities_weights = [1, 1, 1, 1, 1, 1, 1];
		
		this.timer = Spawner.MAX_TIME;
	}
	
	static get MAX_TIME() {return 4};
	//Tempos de spawn aleatórias em um certo range são possívelmente mais satisfatórios.
	//^^^ Possível alteração a se fazer no futuro.
	
	update(deltaTime) {
		if (this.timer > 0) {
			this.timer -= deltaTime / 1000;
			return null;
		}
		
		this.timer = Spawner.MAX_TIME;
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