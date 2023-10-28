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

    velocity;
    mapHeight;
    mapWidth;

    static spawn(roomState) {
        const enemy1 = new EnemyDesavisados(roomState);
        enemy1.enemyAttributes.x = 0;
        enemy1.enemyAttributes.y = (Math.random() * 600);

        const enemy2 = new EnemyDesavisados(roomState);
        /* Pega o intervalo próximo do y do enemy1 para o enemy2 ficar próximo dele */
        let minY = enemy1.enemyAttributes.y - 100;
        if (minY < 0) {
            minY = 0; 
        }
        let maxY = enemy1.enemyAttributes.y + 100;
        if (maxY > 600) {
            maxY = 600;
        }
        enemy2.enemyAttributes.x = 0;
        enemy2.enemyAttributes.y = (Math.random() * (maxY - minY) + minY);


        return [enemy1, enemy2];
    }

    constructor(roomState) {
        super()
        this.init(roomState.enemiesDesavisadoSchema, EnemyDesavisadosSchema)
        
        this.velocity = 2;
        this.mapWidth = 800;
        this.mapHeight = 600;
    }

    update(deltaTime) {

        this.enemyAttributes.x += 2;

        if (this.enemyAttributes.x > 800) {
            this.destroy();
        }
    }
}