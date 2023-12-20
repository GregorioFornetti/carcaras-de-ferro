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
        const randomP = Math.floor(Math.random() * (numPlayers) + 1); //escolhe valor de 1 ate numPlayers aleatoriamente, esse sera o jogador escolhido
        let i = 1
        roomState.playersSchema.forEach((value, key) => {
            //itera entre todos os players
            if (i == randomP) {
                enemy.player = value
            }
            i++
        });

        enemy.enemyAttributes.y = 10
        enemy.enemyAttributes.x = enemy.player.x
        enemy.enemyAttributes.health = CACADOR_HEALTH
        enemy.enemyAttributes.rotation = 90


        console.log("spawn caçador para o player " + randomP)
    
        return [enemy]
    }

    constructor(roomState) {
        super()
        this.init(roomState.enemiesCacadorSchema, EnemyCacadorSchema)

        this.speedX = CACADOR_SPEED
        this.speedY = CACADOR_SPEED
        this.health = CACADOR_HEALTH
        this.score = CACADOR_SCORE
        this.player = null

    }

    update(deltaTime) {

        this.enemyAttributes.y += this.speedY * (deltaTime / 1000);
       
    }

}