/* Definição do estado da sala 
 Todas as variaveis que serão compartilhadas entre os clientes devem ser definidas aqui
 É definido dois estados: o estado do jogador e o estado da sala
 O estado da sala nada mais é do que uma coleção de estados de jogadores
*/
import * as schema from "@colyseus/schema";
import { EnemyDesavisadosSchema } from "../../enemies/EnemyDesavisados.js";
import { PlayerSchema } from "../../player/PlayerSchema.js"
import { BulletSchema } from "../../bullet/Bullet.js"
import { BackgroundSchema } from "../../map/BackgroundSchema.js";
import { EnemySolitarioSchema } from "../../enemies/EnemySolitario.js";
import { EnemyPatrulheirosSchema } from "../../enemies/EnemyPatrulheiros.js";
import { EnemyCombatenteSchema } from "../../enemies/EnemyCombatente.js";


export class MyRoomState extends schema.Schema {
    constructor() {
        super();
        // Adicione os objetos aqui
        this.playersSchema = new schema.MapSchema();
        this.enemiesDesavisadosSchema = new schema.MapSchema();
        this.bulletSchema = new schema.MapSchema()
        this.bgSchema = new BackgroundSchema();
        
        this.enemiesSolitarioSchema = new schema.MapSchema();
        this.enemiesPatrulheirosSchema = new schema.MapSchema();
        this.enemiesCombatenteSchema = new schema.MapSchema();
    }
}

schema.defineTypes(MyRoomState, {
    // Defina o tipo dos objetos do estado aqui
    playersSchema: { map: PlayerSchema },
    enemiesDesavisadosSchema: { map: EnemyDesavisadosSchema },
    enemiesSolitarioSchema: { map: EnemySolitarioSchema },
    enemiesPatrulheirosSchema: { map: EnemyPatrulheirosSchema },
    enemiesCombatenteSchema: { map: EnemyCombatenteSchema },
    bulletSchema: { map: BulletSchema },
    bgSchema: BackgroundSchema
})
