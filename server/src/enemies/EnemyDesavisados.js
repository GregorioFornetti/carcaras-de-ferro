/*
    Exemplo de definição de inimigo
    Cria uma classe que herda a classe Enemy que define sua inicialização, update e destruição
    A inicialização basicmanete coloca o inimigo no jogo, enquanto o update realmente define o comportamento do inimigo
    Para gerar um inimigo, siga os passos:
    1) Crie uma classe que herda Schaema.Schema. Esse é o estado sincronizado do inimigo
    2) Defina os atributos com schema.defineTypes
    3) Crie a classe do inimigo que herda Enemy e implemente seu comportamento com update
    4) Pode ser necessário criar uma função SpawnEnemyX que cria uma instância do inimigo "Schema"
*/
import { Enemy } from './Enemy.js';
import * as schema from "@colyseus/schema";
import {GAME_WIDTH, GAME_HEIGHT} from '../../constants.js';


export class EnemyDesavisadosSchema extends schema.Schema {
    
}

schema.defineTypes(EnemyDesavisadosSchema, {
    x: "number",
    y: "number"
});

export class EnemyDesavisados extends Enemy {

    static spawn(roomState) {
        //define as distancias minima e maxima entre os Desavisados
        const minDistY = 40;
        const maxDistY = 120;
        const maxDistX = 50;

        const enemy1 = new EnemyDesavisados(roomState);
        const enemy2 = new EnemyDesavisados(roomState);

        //calcula coordenada y do spawn
        enemy1.enemyAttributes.y = (Math.random() * GAME_HEIGHT);
        let minY = enemy1.enemyAttributes.y + minDistY;
        let maxY = enemy1.enemyAttributes.y + maxDistY; 
        if (maxY > GAME_HEIGHT) {
            maxY = GAME_HEIGHT;
        }
        enemy2.enemyAttributes.y = (Math.random() * (maxY - minY) + minY);

         //calcula coordenada x do spawn
         if (Math.random() >= 0.5) {
            //spawn na esquerda
            enemy1.enemyAttributes.x = (Math.random() * maxDistX) * -1;
            enemy2.enemyAttributes.x = (Math.random() * maxDistX) * -1;
         } else {
            //spawn na direita
            enemy1.enemyAttributes.x = (Math.random() * ((GAME_WIDTH - maxDistX) - GAME_WIDTH) + GAME_WIDTH);
            enemy2.enemyAttributes.x = (Math.random() * ((GAME_WIDTH - maxDistX) - GAME_WIDTH) + GAME_WIDTH);
            //inverte a velocidade
            const newSpeed = enemy1.speed * -1;
            enemy2.speed = enemy1.speed = newSpeed;
         }


        return [enemy1, enemy2];
    }

    constructor(roomState) {
        super()
        this.init(roomState.enemiesDesavisadosSchema, EnemyDesavisadosSchema)
        
        //define a velocidade dos Desavisados
        this.speed = 300;
        this.width = 16;
        this.height = 16;

    }

    update(deltaTime) {

        this.enemyAttributes.x += this.speed * (deltaTime / 1000);

        if (this.enemyAttributes.x > GAME_WIDTH) {
            this.destroy();
        }
    }
}