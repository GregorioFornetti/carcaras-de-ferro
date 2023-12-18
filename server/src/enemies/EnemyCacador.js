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

        //escolhe um player para caçar
        const numPlayers = roomState.playersSchema.size
        //const idPlayer = Math.floor(Math.random() * (numPlayers - 1) + 1)
        const idPlayer = 1
        const player = roomState.playersSchema.get(idPlayer)

        enemy.enemyAttributes.y = 0
        enemy.enemyAttributes.x = player.x
        enemy.enemyAttributes.health = this.health
        enemy.enemyAttributes.rotation = 90
    
        return [enemy]
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

        this.enemyAttributes.y += this.speed * (deltaTime / 1000);
       
    }

}