/* Aqui é definido a lógica de atualização do jogo, 
   o que deve acontecer quando um jogador realizar uma ação
   e como isso deve ser atualizado para todos os outros jogadores
*/
import { Room } from "@colyseus/core"
import { MyRoomState } from "./schema/MyRoomState.js"
import { EnemyDesavisados } from "../enemies/EnemyDesavisados.js"
import { PlayerSchema } from "../player/PlayerSchema.js"
import { Bullet, BulletSchema } from "../bullet/Bullet.js"
import { Bomba, BombaSchema } from "../bomba/Bomba.js";
import { BackgroundSchema } from "../map/BackgroundSchema.js";
import { EnemySolitario } from "../enemies/EnemySolitario.js";
import { EnemyPatrulheiros } from "../enemies/EnemyPatrulheiros.js";
import { EnemyCombatente } from "../enemies/EnemyCombatente.js";

import { Spawner } from "../enemies/Spawner.js"

export class MyRoom extends Room {
  maxClients = 4
  x = 1

  isShot = false

  // Define o que será feito quando a sala for criada
  // Aqui será definido os callbacks de eventos da sala
  onCreate(options) {
    this.setState(new MyRoomState())

    this.currentEnemies = {}
    this.currentBullets = []
    this.currentBombas = []
    this.velocidadeMapa = 0;
    this.tempoVidaBomba = 3;
    this.timerBomba = this.tempoVidaBomba + 1; //recebe esse valor para o timer nao iniciar automaticamente

    this.spawnCentral = new Spawner(this.state)

    // Gera o game loop, atualização de estado automatica a cada deltaTime
    // https://docs.colyseus.io/server/room/#setsimulationinterval-callback-milliseconds166
    this.setSimulationInterval((deltaTime) => this.update(deltaTime))

    //this.currentEnemies = this.currentEnemies.concat(EnemyDesavisados.spawn(this.state));
    this.onMessage("pressedKeys", (client, message) => {
      // get reference to the player who sent the message
      const player = this.state.playersSchema.get(client.sessionId)

      const speed = 5

      if (message.left) player.x -= speed
      else if (message.right) player.x += speed

      if (message.up) player.y -= speed
      else if (message.down) player.y += speed

      if (message.shot) {
        

        if (this.currentBullets.length === 0) {
          this.currentBullets = this.currentBullets.concat(
            Bullet.spawn(this.state, player, 5, client.sessionId)
          )
        }
      }

      if (message.nuke) {
        if (player.nBombas > 0){
          player.nBombas--
          const bomba = new BombaSchema()
          this.currentBombas = this.currentBombas.concat( Bomba.spawn(this.state, player) )
          this.timerBomba = this.tempoVidaBomba //inicia o timer
        }
      }
    })

    this.onMessage("bulletHitEnemy", (client, message) => {
      this.currentEnemies[message.enemyId].hit()
    });
  }

  /* Define o que será feito quando um jogador conectar na sala
   */
  onJoin(client, options) {
    console.log(client.sessionId, "joined!")

    // Cria uma instância do jogador, definido em MyRoomState.js
    const player = new PlayerSchema()

    // Coloca o jogador na coleção de jogadores da sala
    this.state.playersSchema.set(client.sessionId, player)
  }

  /* Define o que será feito quando um jogador desconectar da sala
   */
  onLeave(client, consented) {
    console.log(client.sessionId, "left!")

    this.state.playersSchema.delete(client.sessionId)
  }

  /* Define o que será feito quando a sala for encerrada
   */
  onDispose() {
    console.log("room", this.roomId, "disposing...")
  }

  // Game loop - essa função será chamada a cada tick ()
  update(deltaTime) {
    //** Movimentação do Mapa */
    this.velocidadeMapa = 1
    this.state.bgSchema.scrollY -= this.velocidadeMapa

    if (this.currentEnemies.length != 0) {
      for (const enemyId in this.currentEnemies) {
        if (this.currentEnemies[enemyId].dead) {
          delete this.currentEnemies[enemyId]
        }
      }
      // this.currentEnemies = this.currentEnemies.filter((enemy) => !enemy.dead)


      // Loop de atualização automática dos inimigos
      for (const enemyId in this.currentEnemies) {
        this.currentEnemies[enemyId].update(deltaTime)
      }

    }

    if (this.currentBullets.length != 0) {
      this.currentBullets = this.currentBullets.filter(
        (bullet) => !bullet.destroyed
      )

      // Loop de atualização automática das balas
      for (let bullet of this.currentBullets) {
        bullet.update(deltaTime)
      }
    }

    if (this.currentBombas.length != 0) {
      this.currentBombas = this.currentBombas.filter(
        (bomba) => !bomba.destroyed
      )
      
      // Loop de atualizacao automatica das bombas
      for (let bomba of this.currentBombas) {
        bomba.update(deltaTime)
      }
    }

    // Explodir bomba e inimigos
    if (this.timerBomba > 0 && this.timerBomba <= this.tempoVidaBomba) {
      this.timerBomba -= deltaTime/1000;
      console.log("timer bomba: " + this.timerBomba)
    } else if (this.timerBomba < 0) {
      for (let bomba of this.currentBombas) {
        bomba.destroy()
      }
      for (let enemy of this.currentEnemies) {
        enemy.onNuke()
      }
      this.timerBomba = this.tempoVidaBomba + 1
    }

    // Loop de atualização automática de balas
    //for (let bullet of this.state.bulletSchema.values()) {
    //  bullet.update(deltaTime)
    //}
    
    let spawn_retorno = this.spawnCentral.update(deltaTime);
    if (spawn_retorno != null) {
      for (let enemy of spawn_retorno) {
        this.currentEnemies[enemy.id] = enemy
      }
      //this.currentEnemies = this.currentEnemies.concat(spawn_retorno)

    }
  }
}
