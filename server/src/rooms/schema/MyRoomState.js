/* Definição do estado da sala 
 Todas as variaveis que serão compartilhadas entre os clientes devem ser definidas aqui
 É definido dois estados: o estado do jogador e o estado da sala
 O estado da sala nada mais é do que uma coleção de estados de jogadores
*/
import * as schema from "@colyseus/schema";
//import { BackgroundSchema } from '../../map/BackgroundSchema';

export class MyRoomState extends schema.Schema {
    constructor() {
        super();
        // Adicione os objetos aqui
        this.playersSchema = new schema.MapSchema();
    }
}

schema.defineTypes(MyRoomState, {
    // Defina o tipo dos objetos do estado aqui
    playersSchema: { map: schema.MapSchema },
})
