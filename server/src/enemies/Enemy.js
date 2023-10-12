import { EnemySchema } from '../rooms/schema/MyRoomState.js';

let enemyId = 0;

export class Enemy {

    constructor(enemies) {
        this.enemyAttributes = new EnemySchema();
        this.enemies = enemies;
        this.id = enemyId++;
        this.enemies.set(this.id, this.enemyAttributes);
        this.dead = false
    }

    update(deltaTime) {
        throw new Error('You have to implement the method update!');
    }

    destroy() {
        if (this.dead) {
            return
        }
        
        this.enemies.delete(this.id);
        this.dead = true
    }
}