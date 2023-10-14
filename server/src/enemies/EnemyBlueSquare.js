import { Enemy } from './Enemy.js';
import * as schema from "@colyseus/schema";


export class EnemyBlueSquareSchema extends schema.Schema {
    
}

schema.defineTypes(EnemyBlueSquareSchema, {
    x: "number",
    y: "number",
    color: "number"
});


export function SpawnEnemyBlueSquare(roomState) {
    const enemy1 = new EnemyBlueSquare(roomState);
    enemy1.enemyAttributes.x = 300;
    enemy1.enemyAttributes.y = 300;

    const enemy2 = new EnemyBlueSquare(roomState);
    enemy2.enemyAttributes.x = 300;
    enemy2.enemyAttributes.y = 400;

    const enemy3 = new EnemyBlueSquare(roomState);
    enemy3.enemyAttributes.x = 400;
    enemy3.enemyAttributes.y = 300;

    const enemy4 = new EnemyBlueSquare(roomState);
    enemy4.enemyAttributes.x = 400;
    enemy4.enemyAttributes.y = 400;

    return [enemy1, enemy2, enemy3, enemy4];
}


export class EnemyBlueSquare extends Enemy {

    constructor(roomState) {
        super()
        this.init(roomState.enemiesBlueSquare, EnemyBlueSquareSchema)

        this.enemyAttributes.color = 0;

        this.timeToChangeColor = 10;  // Tempo em segundos para mudar a cor em segundos
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