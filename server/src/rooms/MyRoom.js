/* Aqui é definido a lógica de atualização do jogo, 
   o que deve acontecer quando um jogador realizar uma ação
   e como isso deve ser atualizado para todos os outros jogadores
*/
import { Room } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState.js";
import { EnemyDesavisados } from "../enemies/EnemyDesavisados.js";

export class MyRoom extends Room {
    maxClients = 4;
    tempoSpawn = 5; //segundos

    // Define o que será feito quando a sala for criada
    // Aqui será definido os callbacks de eventos da sala
    onCreate (options) {
        this.setState(new MyRoomState());

        this.currentEnemies = []

        // Gera o game loop, atualização de estado automatica a cada deltaTime
        // https://docs.colyseus.io/server/room/#setsimulationinterval-callback-milliseconds166
        this.setSimulationInterval((deltaTime) => this.update(deltaTime));
        
        // Define o que fazer quando recebe uma mensagem "0". Apenas loga no console
        this.onMessage(0, (client, message) => {
            // remover
            console.log("Received message from", client.sessionId, ":", message);
        });
        
    }

    /* Define o que será feito quando um jogador conectar na sala 
    */
    onJoin (client, options) {
        console.log(client.sessionId, "joined!");

    }

    /* Define o que será feito quando um jogador desconectar da sala
    */
    onLeave (client, consented) {
        console.log(client.sessionId, "left!");
    }

    /* Define o que será feito quando a sala for encerrada
    */
    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }

    // Game loop - essa função será chamada a cada tick ()
    update(deltaTime) {
        if (this.currentEnemies.length != 0) {
            this.currentEnemies = this.currentEnemies.filter(enemy => !enemy.dead)
        
            // Loop de atualização automática dos inimigos
            for (let enemy of this.currentEnemies) {
                enemy.update(deltaTime)
            }   
        }
        
        if (this.tempoSpawn > 0) {
            this.tempoSpawn -= deltaTime/1000;
        } else {
            this.currentEnemies = this.currentEnemies.concat(EnemyDesavisados.spawn(this.state));
            this.tempoSpawn = 5;
        }
        

    }
}