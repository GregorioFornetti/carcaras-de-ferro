/* Definição do estado da sala 
 Todas as variaveis que serão compartilhadas entre os clientes devem ser definidas aqui
 É definido dois estados: o estado do jogador e o estado da sala
 O estado da sala nada mais é do que uma coleção de estados de jogadores
*/
import * as schema from "@colyseus/schema";
import { EnemyRedSquareSchema } from "../../enemies/EnemyRedSquare.js";
import { EnemyBlueSquareSchema } from "../../enemies/EnemyBlueSquare.js";

export class PlayerSchema extends schema.Schema {

}

schema.defineTypes(PlayerSchema, {
    estadoesquerda: "boolean",
    estadodireita: "boolean",
    estadocima: "boolean",
    estadobaixo: "boolean"
});


export class MyRoomState extends schema.Schema {
    constructor() {
        super();
        this.playersSchema = new schema.MapSchema();
        this.enemiesRedSquareSchema = new schema.MapSchema();
        this.enemiesBlueSquareSchema = new schema.MapSchema();
    }
}

schema.defineTypes(MyRoomState, {
    playersSchema: { map: PlayerSchema },

    enemiesRedSquareSchema: { map: EnemyRedSquareSchema },
    enemiesBlueSquareSchema: { map: EnemyBlueSquareSchema }
    // Adicione os schemas dos inimigos aqui
})
