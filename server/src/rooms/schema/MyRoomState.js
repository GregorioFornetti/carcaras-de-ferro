/* Definição do estado da sala 
 Todas as variaveis que serão compartilhadas entre os clientes devem ser definidas aqui
 É definido dois estados: o estado do jogador e o estado da sala
 O estado da sala nada mais é do que uma coleção de estados de jogadores
*/
import * as schema from "@colyseus/schema";
import { EnemyRedSquareSchema } from "../../enemies/EnemyRedSquare";
import { EnemyBlueSquareSchema } from "../../enemies/EnemyBlueSquare";

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
        this.players = new schema.MapSchema();
        this.enemies = new schema.MapSchema();
    }
}

schema.defineTypes(MyRoomState, {
    players: { map: PlayerSchema },

    enemiesRedSquare: { map: EnemyRedSquareSchema },
    enemiesBlueSquare: { map: EnemyBlueSquareSchema }
    // Adicione os schemas dos inimigos aqui
})
