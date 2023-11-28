import { Enemy } from './Enemy.js';
import * as schema from "@colyseus/schema";
import {GAME_WIDTH, GAME_HEIGHT} from '../../constants.js';

const SCORE = 800
const MAX_HEALTH = 12


export class EnemyFortalezaSchema extends schema.Schema {
    
}

schema.defineTypes(EnemyFortalezaSchema, {
    x: "number",
    y: "number"
});


export class EnemyFortaleza extends Enemy {

    static spawn(roomState) {
        
        const enemy = new EnemyFortaleza(roomState);

        enemy.enemyAttributes.y = 0;
        enemy.enemyAttributes.x = (Math.random() * GAME_WIDTH);

        return enemy;

    }

    constructor(roomState) {
        super()
        this.init(roomState.enemiesFortalezaSchema, EnemyFortalezaSchema)
        
        /* VELOCIDADE FORTALEZA */
        this.speed = 50
        this.health = MAX_HEALTH

    }

    update(deltaTime) {

        this.enemyAttributes.y += this.speed * (deltaTime / 1000);

        if (this.enemyAttributes.y > GAME_HEIGHT){
            this.destroy();
        }
       
    }

    onNuke() {

        this.health = this.health / 2;
        
    }
}