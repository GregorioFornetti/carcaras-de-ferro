import { Enemy } from './Enemy.js';
import * as schema from "@colyseus/schema";


export class EnemyRedSquareSchema extends schema.Schema {
    
}

schema.defineTypes(EnemyRedSquareSchema, {
    x: "number",
    y: "number",
    color: "number"
});


export function SpawnEnemyRedSquare(enemies) {
    const enemy1 = new EnemyRedSquare(enemies);
    enemy1.enemyAttributes.x = 100;
    enemy1.enemyAttributes.y = 100;

    const enemy2 = new EnemyRedSquare(enemies);
    enemy2.enemyAttributes.x = 100;
    enemy2.enemyAttributes.y = 200;

    const enemy3 = new EnemyRedSquare(enemies);
    enemy3.enemyAttributes.x = 200;
    enemy3.enemyAttributes.y = 100;

    const enemy4 = new EnemyRedSquare(enemies);
    enemy4.enemyAttributes.x = 200;
    enemy4.enemyAttributes.y = 200;

    return [enemy1, enemy2, enemy3, enemy4];
}


export class EnemyRedSquare extends Enemy {

    constructor(roomState) {
        this.init(roomState.enemiesRedSquare, EnemyRedSquareSchema)

        this.enemyAttributes.color = 0;

        this.timeToChangeColor = 5;  // Tempo em segundos para mudar a cor em segundos
        this.currentColor = 0;
    }

    update(deltaTime) {
        this.currentColor += 255 * (deltaTime / 1000) / this.timeToChangeColor;
        this.enemyAttributes.color = Math.min(Math.floor(this.currentColor), 255);

        if (this.currentColor > 255) {
            this.destroy()
        }
    }
}