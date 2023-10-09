/* Aqui é definido a lógica de atualização do jogo, 
   o que deve acontecer quando um jogador realizar uma ação
   e como isso deve ser atualizado para todos os outros jogadores
*/
import { Room } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState.js";
import { Player } from "./schema/MyRoomState.js";

export class MyRoom extends Room {
    maxClients = 4;

    onCreate (options) {
        this.setState(new MyRoomState());

        /* 
        controla o que deve acontecer quando um jogador enviar um input
        A mensagem pode ter um nome, nesse caso, o nome é "0"
        */
        this.onMessage(0, (client, data) => {
            // get reference to the player who sent the message
            const player = this.state.players.get(client.sessionId);

            console.log(`Input recebido do player ${client.sessionId}: left: ${data.left}, right: ${data.right}, up: ${data.up}, down: ${data.down}`)

            player.estadoesquerda = data.left
            player.estadodireita = data.right
            player.estadocima = data.up
            player.estadobaixo = data.down
        });
    }

    /* Define o que será feito quando um jogador conectar na sala 
    */
    onJoin (client, options) {
        console.log(client.sessionId, "joined!");

        // Cria uma instância do jogador, definido em MyRoomState.js
        const player = new Player();

        // Coloca o jogador na coleção de jogadores da sala
        this.state.players.set(client.sessionId, player);
    }

    /* Define o que será feito quando um jogador desconectar da sala
    */
    onLeave (client, consented) {
        console.log(client.sessionId, "left!");

        this.state.players.delete(client.sessionId);
    }

    /* Define o que será feito quando a sala for encerrada
    */
    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }
}