import { EnemyCacador } from "../enemies/EnemyCacador.js";
import { EnemyCombatente } from "../enemies/EnemyCombatente.js";
import { EnemyCruzador } from "../enemies/EnemyCruzador.js";
import { EnemyDesavisados } from "../enemies/EnemyDesavisados.js";
import { EnemyFortaleza } from "../enemies/EnemyFortaleza.js";
import { EnemyPatrulheiros } from "../enemies/EnemyPatrulheiros.js";
import { EnemySolitario } from "../enemies/EnemySolitario.js";

export class DifficultySystem {
  constructor() {
    this.credits = 10;
  }

  updateCredits(time) {
    this.credits = time
  }

  update(time) {
    this.updateCredits(time)
  }

  getCredits() {
    return this.credits;
  }

  getSolitarioWeight() {return 4}
  getPatrulheirosWeight() {return 3}
  getDesavisadosWeight() {return 2}
  getCombatenteWeight() {return 1}
  getFortalezaWeight() {return 1}
  getCacadorWeight() {return 1}
  getCruzadorWeight() {return 1}
  
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
    return [1, 1, 1, 1, 1, 1, 1];
  }

  getSpawnTimer() {
    return 0.5;
  }

  getMapSpeed() {
    return 1;
  }

  getItemSpawnProbability() {
    return 0.4;
  }
}