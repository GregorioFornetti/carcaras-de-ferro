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


export class EnemyDesavisadosSchema extends schema.Schema {
    
}

schema.defineTypes(EnemyDesavisadosSchema, {
    x: "number",
    y: "number"
});

export class EnemyDesavisados extends Enemy {

    static spawn(roomState) {
        const enemy1 = new EnemyDesavisados(roomState);
        enemy1.enemyAttributes.x = -16;
        enemy1.enemyAttributes.y = (Math.random() * 600);

        const enemy2 = new EnemyDesavisados(roomState);
        //define a distancia minima entre os Desavisados
        let minY = enemy1.enemyAttributes.y + 40;
        //define a distancia maxima entre os Desavisados
        let maxY = enemy1.enemyAttributes.y + 120; 
        if (maxY > 600) {
            maxY = 600;
        }
        enemy2.enemyAttributes.x = -16;
        enemy2.enemyAttributes.y = (Math.random() * (maxY - minY) + minY);


        return [enemy1, enemy2];
    }

    constructor(roomState) {
        super()
        this.init(roomState.enemiesDesavisadosSchema, EnemyDesavisadosSchema)
        
        //define a velocidade dos Desavisados
        this.speed = 300;
    }

    update(deltaTime) {

        this.enemyAttributes.x += this.speed * (deltaTime / 1000);

        if (this.enemyAttributes.x > 800) {
            this.destroy();
        }
    }
}