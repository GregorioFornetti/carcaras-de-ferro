import { Enemy } from './Enemy.js';
import * as schema from "@colyseus/schema";

import {GAME_WIDTH, GAME_HEIGHT, CRUZADOR_SPEED, CRUZADOR_HEALTH, CRUZADOR_SCORE, CRUZADOR_FIRERATE} from '../../constants.js';

export class EnemyCruzadorSchema extends schema.Schema {
    
}

schema.defineTypes(EnemyCruzadorSchema, {
    x: "number",
    y: "number",
    angle: "number",
    health: "number"
});

export class EnemyCruzador extends Enemy {

    static spawn(roomState) {

        const enemy = new EnemyCruzador(roomState)

        enemy.enemyAttributes.y = (Math.random() * (GAME_HEIGHT/2));
        if (Math.random() >= 0.5){
            enemy.goingRight = true
            enemy.enemyAttributes.x = 0
            enemy.enemyAttributes.angle = 135
        } else {
            enemy.enemyAttributes.x = GAME_WIDTH
            enemy.enemyAttributes.angle = -135
        }
        
        return [enemy]
    }

    constructor(roomState) {
        super()
        this.init(roomState.enemiesCruzadorSchema, EnemyCruzadorSchema)

        this.speed = CRUZADOR_SPEED
        this.health = CRUZADOR_HEALTH
        this.score = CRUZADOR_SCORE
        this.goingRight = false

        this.timerShoot = CRUZADOR_FIRERATE

    }

    update(deltaTime) {

        if (this.enemyAttributes.y > GAME_HEIGHT || 
            this.enemyAttributes.x > GAME_WIDTH+20 ||
            this.enemyAttributes.x < -20) {

                this.destroy()
        }

        this.enemyAttributes.y += this.speed * (deltaTime / 1000)
        if (this.goingRight) {
            this.enemyAttributes.x += this.speed * (deltaTime / 1000)
        } else {
            this.enemyAttributes.x -= this.speed * (deltaTime / 1000)
        }


        //Disparo
        if (this.timerShoot <= 0){
            this.timerShoot = CRUZADOR_FIRERATE
            console.log("disparo cruazdor")
            if (this.goingRight) {
                return {
                    'action': 'SHOOT',
                    'angle': this.enemyAttributes.angle,
                    'speedY': this.speed*2,
                    'speedX':  this.speed*2,
                    'offsetX': 20,
                    'offsetY': 20,
                    'size': 3,
                    'entity': this.enemyAttributes,
                }
            } 

            return {
                'action': 'SHOOT',
                'angle': this.enemyAttributes.angle,
                'speedY': this.speed*2,
                'speedX': this.speed*2,
                'offsetX': -20,
                'offsetY': 20,
                'size': 3,
                'entity': this.enemyAttributes,
            }

        } else {
            this.timerShoot -= deltaTime/1000
        }


    }

}