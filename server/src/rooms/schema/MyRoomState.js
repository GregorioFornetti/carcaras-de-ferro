/* Definição do estado da sala 
 Todas as variaveis que serão compartilhadas entre os clientes devem ser definidas aqui
 É definido dois estados: o estado do jogador e o estado da sala
 O estado da sala nada mais é do que uma coleção de estados de jogadores
*/
import * as schema from "@colyseus/schema";
import { BombaSchema } from "../../bomba/Bomba.js";
import { BulletSchema } from "../../bullet/Bullet.js";
import { EnemyCacadorSchema } from "../../enemies/EnemyCacador.js";
import { EnemyCombatenteSchema } from "../../enemies/EnemyCombatente.js";
import { EnemyCruzadorSchema } from "../../enemies/EnemyCruzador.js";
import { EnemyDesavisadosSchema } from "../../enemies/EnemyDesavisados.js";
import { EnemyFortalezaSchema } from "../../enemies/EnemyFortaleza.js";
import { EnemyPatrulheirosSchema } from "../../enemies/EnemyPatrulheiros.js";
import { EnemySolitarioSchema } from "../../enemies/EnemySolitario.js";
import { ItemBombSchema } from "../../items/ItemBomb.js";
import { ItemLifeSchema } from "../../items/ItemLife.js";
import { BackgroundSchema } from "../../map/BackgroundSchema.js";
import { PlayerSchema } from "../../player/PlayerSchema.js";


export class MyRoomState extends schema.Schema {
    constructor() {
        super();
        // Adicione os objetos aqui
        this.playersSchema = new schema.MapSchema();
        this.enemiesDesavisadosSchema = new schema.MapSchema();
        this.bulletSchema = new schema.MapSchema();
        this.bombaSchema = new schema.MapSchema();
        this.itemBombSchema = new schema.MapSchema();
        this.itemLifeSchema = new schema.MapSchema();
        this.bgSchema = new BackgroundSchema();
        
        this.enemiesSolitarioSchema = new schema.MapSchema();
        this.enemiesPatrulheirosSchema = new schema.MapSchema();
        this.enemiesCombatenteSchema = new schema.MapSchema();
        this.enemiesFortalezaSchema = new schema.MapSchema();
        this.enemiesCacadorSchema = new schema.MapSchema();
        this.enemiesCruzadorSchema = new schema.MapSchema();

        
    }
}

schema.defineTypes(MyRoomState, {
    // Defina o tipo dos objetos do estado aqui
    playersSchema: { map: PlayerSchema },
    enemiesDesavisadosSchema: { map: EnemyDesavisadosSchema },
    enemiesSolitarioSchema: { map: EnemySolitarioSchema },
    enemiesPatrulheirosSchema: { map: EnemyPatrulheirosSchema },
    enemiesCombatenteSchema: { map: EnemyCombatenteSchema },
    enemiesFortalezaSchema: { map: EnemyFortalezaSchema },
    enemiesCacadorSchema: { map: EnemyCacadorSchema },
    enemiesCruzadorSchema: { map: EnemyCruzadorSchema },
    bulletSchema: { map: BulletSchema },
    bombaSchema: { map: BombaSchema },
    itemBombSchema: { map: ItemBombSchema },
    itemLifeSchema: { map: ItemLifeSchema },
    bgSchema: BackgroundSchema
})
