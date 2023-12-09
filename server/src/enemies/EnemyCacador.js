import { Enemy } from './Enemy.js';
import * as schema from "@colyseus/schema";

import {GAME_WIDTH, GAME_HEIGHT, CACADOR_SPEED, CACADOR_HEALTH, CACADOR_SCORE} from '../../constants.js';


export class EnemyCacadorSchema extends schema.Schema {
    
}

schema.defineTypes(EnemyCacadorSchema, {
    x: "number",
    y: "number",
    health: "number",
    rotation: "number"
});


export class EnemyCacador extends Enemy {

    static spawn(roomState) {
        
        const enemy = new EnemyCacador(roomState)

        
    
        return enemy
    }

    constructor(roomState) {
        super()
        this.init(roomState.enemiesCacadorSchema, EnemyCacadorSchema)

        this.speedX = CACADOR_SPEED
        this.speedY = CACADOR_SPEED
        this.health = CACADOR_HEALTH
        this.score = CACADOR_SCORE
       

    }

    update(deltaTime) {

       
    }

}