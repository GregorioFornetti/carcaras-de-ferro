/* Aqui é definido a lógica de atualização do jogo, 
   o que deve acontecer quando um jogador realizar uma ação
   e como isso deve ser atualizado para todos os outros jogadores
*/
import { Room, matchMaker} from "@colyseus/core"
import { MyRoomState } from "./schema/MyRoomState.js"
import { EnemyDesavisados } from "../enemies/EnemyDesavisados.js"
import { PlayerSchema, Player } from "../player/PlayerSchema.js"
import { Bullet, BulletSchema } from "../bullet/Bullet.js"
import { Bomba, BombaSchema } from "../bomba/Bomba.js";
import { BackgroundSchema } from "../map/BackgroundSchema.js";
import { EnemySolitario } from "../enemies/EnemySolitario.js";
import { EnemyPatrulheiros } from "../enemies/EnemyPatrulheiros.js";
import { EnemyCombatente } from "../enemies/EnemyCombatente.js";
import { Collisor } from "../collisor/Collissor.js"

import { Spawner } from "../enemies/Spawner.js"
import { GAME_HEIGHT, GAME_WIDTH } from "../../constants.js"
import { EnemyFortaleza } from "../enemies/EnemyFortaleza.js"

export class MyRoom extends Room {
  maxClients = 4
  x = 1

  isShot = false

  // Define o que será feito quando a sala for criada
  // Aqui será definido os callbacks de eventos da sala
  onCreate(options) {
    if (options) {
      this.oldOwner = options['oldOwner']
    }
    this.setState(new MyRoomState())

    this.currentPlayers = {}
    this.currentEnemies = {}
    this.currentBullets = {}
    this.currentBombas = []
    this.velocidadeMapa = 0;

    this.freeze = true
    this.roomOwner = undefined
    this.collisor = new Collisor()
    this.collisor.registerActionForCollission("bullet", "enemy", (bullet, enemy) => {
      bullet.destroy()
      // this.collisor.removeForCollission(bullet, "bullet")
      // delete this.currentBullets[bullet.id]
      const score = enemy.hit()
      const player = this.state.playersSchema.get(bullet.owner)
      if (score) {
        player.score += score
      }
    })
    this.collisor.registerActionForCollission("player", "enemy", (player, enemy) => {
      let didhit = player.hit()
      if (didhit) { // se o player está imortal, não destroi os inimigos na colisão
        enemy.destroy()
        // this.collisor.removeForCollission(enemy, "enemy")
        // delete this.currentEnemies[enemy.id]
        // console.log("player collided with enemy!, health in: ", player.playerAtributes.health)
        // if (player.dead) {
        //   console.log("player died! :( Removing from collisor")
        //  this.collisor.removeForCollission(player, "player")
        // }
      }  
    })
    this.collisor.registerActionForCollission("player", "bulletEnemy", (player, enemyBullet) => {
      let didhit = player.hit()
      if (didhit) { // se o player está imortal, não destroi os inimigos na colisão
        enemyBullet.destroy()
        // this.collisor.removeForCollission(enemyBullet, "bulletEnemy")
        // delete this.currentBullets[enemyBullet.id]
        // console.log("player collided with enemy bullet!, health in: ", player.playerAtributes.health)
        // if (player.dead) {
        //  console.log("player died! :( Removing from collisor")
        //  this.collisor.removeForCollission(player, "player")
        // }
      }
    })

    this.spawnCentral = new Spawner(this.state)
    

    // Gera o game loop, atualização de estado automatica a cada deltaTime
    // https://docs.colyseus.io/server/room/#setsimulationinterval-callback-milliseconds166
    this.setSimulationInterval((deltaTime) => this.update(deltaTime))

    //this.currentEnemies = this.currentEnemies.concat(EnemyDesavisados.spawn(this.state));
    this.onMessage("pressedKeys", (client, message) => {
      // get reference to the player who sent the message
      return
    })

    this.onMessage("UP", (client, message) => {
      if (this.currentPlayers[client.sessionId].dead || this.freeze) return
      this.currentPlayers[client.sessionId].setMovement("up", message.pressed)
    })

    this.onMessage("DOWN", (client, message) => {
      if (this.currentPlayers[client.sessionId].dead || this.freeze) return
      this.currentPlayers[client.sessionId].setMovement("down", message.pressed)
    })

    this.onMessage("LEFT", (client, message) => {
      if (this.currentPlayers[client.sessionId].dead || this.freeze) return
      this.currentPlayers[client.sessionId].setMovement("left", message.pressed)
    })

    this.onMessage("RIGHT", (client, message) => {
      if (this.currentPlayers[client.sessionId].dead || this.freeze) return
      this.currentPlayers[client.sessionId].setMovement("right", message.pressed)
    })
    
    this.onMessage("FIRE", (client, message) => {
      if (this.currentPlayers[client.sessionId].dead || this.freeze) return
      let newBullet = this.currentPlayers[client.sessionId].fire();
      this.currentBullets[newBullet.id] = newBullet
      this.collisor.registerForCollission(newBullet,newBullet.bulletAttributes,"bullet")
    })

    this.onMessage("NUKE", (client, message) => {
      if (this.currentPlayers[client.sessionId].dead || this.freeze) return
      let newBomba = this.currentPlayers[client.sessionId].nuke();
      if (newBomba !== undefined) {
        this.currentBombas = this.currentBombas.concat(newBomba)
        this.timerBomba = this.tempoVidaBomba //inicia o timer
      }
    })

    this.onMessage("STARTGAME", (client, message) => {
      if (client.id === this.roomOwner) {
        this.freeze = false
      }
    })
    
    this.onMessage("RESTARTGAME", async (client, message) => {
      if (client.id === this.roomOwner) {
        const newRoom = await matchMaker.createRoom("my_room", { oldOwner: this.roomOwner })
        this.broadcast("RESTARTGAME", newRoom.roomId)
      }
    })
  }

  /* Define o que será feito quando um jogador conectar na sala
   */
  onJoin(client, options) {
    let oldId = options['oldId']

    // Cria uma instância do jogador, definido em MyRoomState.js
    const player = Player.spawn(this.state, client.sessionId,
      Math.random()*(GAME_WIDTH/2) + 100,
      3*(GAME_HEIGHT)/4
      )
    this.collisor.registerForCollission(player, player.playerAtributes, "player")
    this.currentPlayers[client.id] = player

    // Se for a primeira vez com a sala criada, o dono será o primeiro a entrar
    // Caso a sala seja recriada para reiniciar o jogo, os jogadores dela irão enviar os ids deles
    // e nesse caso o dono será o antigo dono da sala (ao invés de ser o primeiro a entrar)
    if ((this.roomOwner === undefined && this.oldOwner === undefined) || 
        (this.roomOwner === undefined && this.oldOwner === oldId)) {
      this.roomOwner = client.id
    }
  }

  /* Define o que será feito quando um jogador desconectar da sala
   */
  onLeave(client, consented) {
    console.log(client.sessionId, "left!")

    this.state.playersSchema.delete(client.sessionId)
    this.collisor.removeForCollission(this.currentPlayers[client.sessionId], "player")
    delete this.currentPlayers[client.sessionId]
  }

  /* Define o que será feito quando a sala for encerrada
   */
  onDispose() {
    console.log("room", this.roomId, "disposing...")
  }

  // Game loop - essa função será chamada a cada tick ()
  update(deltaTime) {
    if (this.freeze) return
    // Update do jogador, levando em conta os inputs
    // E se o player morrer? Alterar no collisor
    for (let player in this.currentPlayers) {
      // Limpa os jogadores que morreram
      if (this.currentPlayers[player].dead) {
        console.log("player died! :( Removing from collisor")
        this.collisor.removeForCollission(this.currentPlayers[player], "player")
      }
    }
    for (let player in this.currentPlayers) {
      // Loop de atualização automática dos players
      this.currentPlayers[player].update(deltaTime)
    }
    /* FIM PLAYER */

    //** Movimentação do Mapa */
    this.velocidadeMapa = 1
    this.state.bgSchema.scrollY -= this.velocidadeMapa

    if (this.currentEnemies.length != 0) {
      /* Limpandos os inimigos que morreram */
      for (let enemyId in this.currentEnemies) {
        if (this.currentEnemies[enemyId].dead) {
          this.collisor.removeForCollission(this.currentEnemies[enemyId], "enemy")
          delete this.currentEnemies[enemyId]
        }
      }
      // Loop de atualização automática dos inimigos
      for (const enemyId in this.currentEnemies) {
        let action = this.currentEnemies[enemyId].update(deltaTime)
        if (action !== undefined) {
          if (action.action == 'SHOOT') {
            let newBullet = Bullet.spawn(
              this.state, 
              action.entity,
              "SERVER",
              action.speedX * Math.sin((action.angle * Math.PI) / 180),
              action.speedY * Math.sin((action.angle * Math.PI) / 180),
              action.offsetX, 
              action.offsetY,
              action.rotation
            );
            newBullet.bulletAttributes.size = action.size
            this.currentBullets[newBullet.id] = newBullet;
            this.collisor.registerForCollission(newBullet,newBullet.bulletAttributes,"bulletEnemy")
          }
        }
      }
		}

    if (this.currentBullets.length != 0) {
      /* Limpando as balas que devem ser destruidas */
      for (let bulletId in this.currentBullets) {
        if (this.currentBullets[bulletId].destroyed) {
          this.collisor.removeForCollission(this.currentBullets[bulletId], "bullet")
          delete this.currentBullets[bulletId]
        }
      }
      // Loop de atualização automática das balas
      for (let bullet of Object.values(this.currentBullets)) {
        bullet.update(deltaTime)
      }
    }
  
    if (this.currentBombas.length != 0) {
      // Loop de atualizacao automatica das bombas
      for (let bomba of this.currentBombas) {
        bomba.update(deltaTime)

        // Bomba explodiu, detruir inimigos e remover bomba
        if (bomba.timeToExplode <= 0) {
          bomba.destroy()
          const player = this.state.playersSchema.get(bomba.owner)
          for (let enemyId in this.currentEnemies) {
            const score = this.currentEnemies[enemyId].onNuke()
            if (score) {
              player.score += score
              this.collisor.removeForCollission(this.currentEnemies[enemyId], "enemy")
              delete this.currentEnemies[enemyId]
            }
          }
        }
      }

      // Remover bomba do array de bombas
      this.currentBombas = this.currentBombas.filter(bomba => !bomba.destroyed)
    }
      
    let spawn_retorno = this.spawnCentral.update(deltaTime);
    if (spawn_retorno != null) {
      for (let enemy of spawn_retorno) {
        this.currentEnemies[enemy.id] = enemy
        this.collisor.registerForCollission(enemy, enemy.enemyAttributes, "enemy")
      }
    }
  
    // Aplica os efeitos de colisões de objetos, se existirem 
    this.collisor.update()
  }
}
