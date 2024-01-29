import { EnemyCacador } from "../enemies/EnemyCacador.js";
import { EnemyCombatente } from "../enemies/EnemyCombatente.js";
import { EnemyCruzador } from "../enemies/EnemyCruzador.js";
import { EnemyDesavisados } from "../enemies/EnemyDesavisados.js";
import { EnemyFortaleza } from "../enemies/EnemyFortaleza.js";
import { EnemyPatrulheiros } from "../enemies/EnemyPatrulheiros.js";
import { EnemySolitario } from "../enemies/EnemySolitario.js";

export class DifficultySystem {
  constructor() {
    this.credits = 0;
    this.spawnTimer = 4;
    this.itemSpawnProbability = 0.5;
  }

  updateCredits(time) {
    this.credits = Math.log2(time);
  }

  update(time) {
    this.updateCredits(time)
  }

  getCredits() {
    return this.credits;
  }

  getSolitarioWeight() {
    return 4
  }

  getPatrulheirosWeight() {
    return 3
  }

  getDesavisadosWeight() {
    return 2
  }

  getCombatenteWeight() {
    return 1
  }

  getFortalezaWeight() {
    return 1
  }

  getCacadorWeight() {
    return 1
  }

  getCruzadorWeight() {
    return 1
  }
  
  getEnemiesWeights() {
    this.enemies = [];

    this.enemies.push ({"enemy": EnemySolitario, "weight": this.getSolitarioWeight()});
    this.enemies.push ({"enemy": EnemyPatrulheiros, "weight": this.getPatrulheirosWeight()});
    this.enemies.push ({"enemy": EnemyDesavisados, "weight": this.getDesavisadosWeight()});
    this.enemies.push ({"enemy": EnemyCombatente, "weight": this.getCombatenteWeight()});
    this.enemies.push ({"enemy": EnemyFortaleza, "weight": this.getFortalezaWeight()});
    this.enemies.push ({"enemy": EnemyCacador, "weight": this.getCacadorWeight()});
    this.enemies.push ({"enemy": EnemyCruzador, "weight": this.getCruzadorWeight()});

    return this.enemies;
  }

  getSpawnQuantities() {
    let spawnQuantities = [1, 1, 1, 1, 1, 1, 1];
    let totalWeight = 0;
   
    // Calculate total weight
    for (let i = 0; i < spawnQuantities.length; i++) {
       totalWeight += spawnQuantities[i];
    }
   
    // Adjust weights based on the number of credits earned
    for (let i = 0; i < spawnQuantities.length; i++) {
       spawnQuantities[i] = spawnQuantities[i] * (1 - (this.credits / totalWeight));
    }
   
    // Normalize weights to sum to 1
    for (let i = 0; i < spawnQuantities.length; i++) {
       spawnQuantities[i] = spawnQuantities[i] / totalWeight;
    }
   
    return spawnQuantities;
  }

  getSpawnTimer() {
    const spawnTime = 4 - Math.floor((this.credits / 15));
    return spawnTime >= 0.8 ? spawnTime : 0.8;
  }

  getMapSpeed() {
    const mapSpeed = 1 + (this.credits / 10);
    
    if(mapSpeed < 1) {
      return 1;
    } else if(mapSpeed > 4) { // Velocidade máxima do mapa
      return 5;
    } else {
      return mapSpeed;
    }

  }

  getItemSpawnProbability() {
    if (this.credits < 0) {
      this.itemSpawnProbability = this.itemSpawnProbability;
    } else {
      if(this.itemSpawnProbability <= 0.15) {
        this.itemSpawnProbability = 0.15;
      } else {
        this.itemSpawnProbability -= this.credits / (500 * 500);
      }
    }
     
    return this.itemSpawnProbability;
  }
}