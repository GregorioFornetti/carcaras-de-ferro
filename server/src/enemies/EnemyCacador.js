import { Enemy } from './Enemy.js';
import * as schema from "@colyseus/schema";

import {GAME_WIDTH, GAME_HEIGHT, CACADOR_SPEED, CACADOR_HEALTH, CACADOR_SCORE} from '../../constants.js';


export class EnemyCacadorSchema extends schema.Schema {
    
}

schema.defineTypes(EnemyCacadorSchema, {
    x: "number",
    y: "number",
    health: "number",
    angle: "number"
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

        enemy.enemyAttributes.y = 0
        enemy.enemyAttributes.x = enemy.player.x
        enemy.enemyAttributes.health = CACADOR_HEALTH
        enemy.enemyAttributes.angle = 180


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

        if (this.enemyAttributes.y > GAME_HEIGHT) {
            this.destroy();
            //console.log("cacador destruido")
        }

        //Determina o angulo

        let enemyY = GAME_HEIGHT - this.enemyAttributes.y
        let playerY = GAME_HEIGHT - this.player.y

        let eq = (enemyY - playerY) / 
                 (this.enemyAttributes.x - this.player.x)
        let rad = Math.atan(eq)
        this.enemyAttributes.angle = rad * (180 / Math.PI)

        console.log(eq + ", " + this.enemyAttributes.angle)

        //Determina as velocidades
        //this.speedY = CACADOR_SPEED * Math.sin(rad)
        //this.speedX = CACADOR_SPEED * Math.cos(rad)
        
        //Atualiza posição
        this.enemyAttributes.y += this.speedY * (deltaTime / 1000);
        //this.enemyAttributes.x += this.speedX * (deltaTime / 1000);
       
    }

}