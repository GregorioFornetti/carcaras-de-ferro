import { Enemy } from './Enemy.js';


export function SpawnEnemyTeste(enemies) {
    const enemy1 = new EnemyTeste(enemies);
    enemy1.enemyAttributes.x = 100;
    enemy1.enemyAttributes.y = 100;

    const enemy2 = new EnemyTeste(enemies);
    enemy2.enemyAttributes.x = 100;
    enemy2.enemyAttributes.y = 200;

    const enemy3 = new EnemyTeste(enemies);
    enemy3.enemyAttributes.x = 200;
    enemy3.enemyAttributes.y = 100;

    const enemy4 = new EnemyTeste(enemies);
    enemy4.enemyAttributes.x = 200;
    enemy4.enemyAttributes.y = 200;

    return [enemy1, enemy2, enemy3, enemy4];
}


export class EnemyTeste extends Enemy {

    constructor(enemies) {
        super(enemies)

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

    destroy() {
        super.destroy();
    }
}