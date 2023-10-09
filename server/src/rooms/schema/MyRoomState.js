/* Definição do estado da sala 
 Todas as variaveis que serão compartilhadas entre os clientes devem ser definidas aqui
 É definido dois estados: o estado do jogador e o estado da sala
 O estado da sala nada mais é do que uma coleção de estados de jogadores
*/
import * as schema from "@colyseus/schema";

export class Player extends schema.Schema {

}

schema.defineTypes(Player, {
    estadoesquerda: "boolean",
    estadodireita: "boolean",
    estadocima: "boolean",
    estadobaixo: "boolean"
});


export class MyRoomState extends schema.Schema {
    constructor() {
        super();
        this.players = new schema.MapSchema();
    }
}

schema.defineTypes(MyRoomState, {
    players: { map: Player },
})
