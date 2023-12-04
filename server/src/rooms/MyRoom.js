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
    this.setState(new MyRoomState())

    this.currentPlayers = {}
    this.currentEnemies = {}
    this.currentBullets = {}
    this.currentBombas = []
    this.velocidadeMapa = 0;
    this.tempoVidaBomba = 2;
    this.timerBomba = this.tempoVidaBomba + 1; //recebe esse valor para o timer nao iniciar automaticamente

    this.collisor = new Collisor()
    this.collisor.registerActionForCollission("bullet", "enemy", (bullet, enemy) => {
      bullet.destroy()
      const score = enemy.hit()
      const player = this.state.playersSchema.get(bullet.owner)
      if (score) {
        player.score += score
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
      this.currentPlayers[client.sessionId].up = message.pressed
    })

    this.onMessage("DOWN", (client, message) => {
      this.currentPlayers[client.sessionId].down = message.pressed
    })

    this.onMessage("LEFT", (client, message) => {
      this.currentPlayers[client.sessionId].left = message.pressed
    })

    this.onMessage("RIGHT", (client, message) => {
      this.currentPlayers[client.sessionId].right = message.pressed
    })

    this.onMessage("FIRE", (client, message) => {
      const player = this.state.playersSchema.get(client.sessionId)
      this.currentPlayers[client.sessionId].fire = true
      const bullet = new BulletSchema()
      bullet.x = player.x
      bullet.y = player.y - 20
      bullet.speed = 5
      bullet.destroyed = false
      let newBullet = Bullet.spawn(this.state, player, 5, client.sessionId)
      this.currentBullets[newBullet.id] = newBullet
      this.collisor.registerForCollission(newBullet,newBullet.bulletAttributes,"bullet")
    })

    this.onMessage("NUKE", (client, message) => {
      const player = this.state.playersSchema.get(client.sessionId)
      this.currentPlayers[client.sessionId].nuke = true
      if (player.nBombas > 0) {
          player.nBombas--
          const bomba = new BombaSchema()
          this.currentBombas = this.currentBombas.concat( Bomba.spawn(this.state, player, client.sessionId) )
          this.timerBomba = this.tempoVidaBomba //inicia o timer
        }
    })

  }

  /* Define o que será feito quando um jogador conectar na sala
   */
  onJoin(client, options) {
    console.log(client.sessionId, "joined!")

    // Cria uma instância do jogador, definido em MyRoomState.js
    const player = new PlayerSchema()

    // Coloca o jogador na coleção de jogadores da sala
    this.state.playersSchema.set(client.sessionId, player)
    // PROVISORIO
    this.currentPlayers[client.sessionId] = {
      up: false, 
      down: false, 
      left: false, 
      right: false, 
      fire: false, 
      nuke: false, 
      dano: false
    }
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
    // Update do jogador, levando em conta os inputs
    // PROVISORIO
    for (let iclient in this.currentPlayers) {
      let client = this.currentPlayers[iclient]
      const player = this.state.playersSchema.get(iclient)
      const message = this.currentPlayers[iclient]
      const speed = 5

      if (message.left) {
        player.x -= speed * (deltaTime / 1000);
        player.currentAnimation = "ship_esquerda";
        player.currentAnimation = "ship_esquerda_reverse";
      } else if (message.right) {
        player.x += speed * (deltaTime / 1000);
        player.currentAnimation = "ship_direita";
        player.currentAnimation = "ship_direita_reverse";

      }

      if (message.up) { 
        player.y -= speed * (deltaTime / 1000); 
        if(!message.left && !message.right)
          player.currentAnimation = `ship_frente_d${player.dano}`;
      } else if (message.down) {
        player.y += speed * (deltaTime / 1000);
        if(!message.left && !message.right)
          player.currentAnimation = `ship_frente_d${player.dano}`;
      }

      const MIN_X = 0
      const MAX_X = GAME_WIDTH
      const MIN_Y = 0
      const MAX_Y = GAME_HEIGHT

      if (message.left) {
        player.x = Math.max(player.x - speed, MIN_X)
      } else if (message.right) {
        player.x = Math.min(player.x + speed, MAX_X)
      }

      if (message.up) { 
        player.y = Math.max(player.y - speed, MIN_Y)
      } else if (message.down) { 
        player.y = Math.min(player.y + speed, MAX_Y)
      }

      if (message.dano) {
        if (player.dano == 0) {
          player.dano++;
          player.currentAnimation = `ship_frente_d${player.dano}`;
        } 
        else if (player.dano == 1) {
          player.dano++;
          player.currentAnimation = `ship_frente_d${player.dano}`;
        } 
      }
    }
    /* FIM PLAYER */

    //** Movimentação do Mapa */
    this.velocidadeMapa = 1
    this.state.bgSchema.scrollY -= this.velocidadeMapa

    if (this.currentEnemies.length != 0) {
      for (const enemyId in this.currentEnemies) {
        if (this.currentEnemies[enemyId].dead) {
          this.collisor.removeForCollission(this.currentEnemies[enemyId], "bullet")
          delete this.currentEnemies[enemyId]
        }
      }
      // this.currentEnemies = this.currentEnemies.filter((enemy) => !enemy.dead)


      // Loop de atualização automática dos inimigos
      for (const enemyId in this.currentEnemies) {
        this.currentEnemies[enemyId].update(deltaTime)
        const enemy = this.currentEnemies[enemyId]
        //Disparo Fortaleza
        if (enemy instanceof EnemyFortaleza){
          if (enemy.shoot == true){
            const bullet = new BulletSchema()
            let newBullet = Bullet.spawn(this.state, enemy.enemyAttributes, -5, "inimigo")
            this.currentBullets[newBullet.id] = newBullet
            this.collisor.registerForCollission(newBullet,newBullet.bulletAttributes,"bulletEnemy")
            enemy.shoot = false
          }
        }
      }
    }

    if (this.currentBullets.length != 0) {
      // Loop de atualização automática das balas
      for (let bullet of Object.values(this.currentBullets)) {
        if (bullet.destroyed) {
          this.collisor.removeForCollission(bullet, "bullet")
          delete this.currentBullets[bullet.id]
        }
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
    } else if (this.timerBomba < 0) {
      const bomba = this.currentBombas[0]  // O mais certo seria um timer para cada bomba, mas por enquanto vou só pegar o primeiro
      const player = this.state.playersSchema.get(bomba.owner)
      for (let enemyId in this.currentEnemies) {
        const score = this.currentEnemies[enemyId].onNuke()
        if (score) {
          player.score += score
        }
      }
      for (let bomba of this.currentBombas) {
        bomba.destroy()
      }
      this.timerBomba = this.tempoVidaBomba + 1
    }
    
    let spawn_retorno = this.spawnCentral.update(deltaTime);
    if (spawn_retorno != null) {
      for (let enemy of spawn_retorno) {
        this.currentEnemies[enemy.id] = enemy
      }
      for (let enemy of spawn_retorno) {
        this.collisor.registerForCollission(enemy, enemy.enemyAttributes, "enemy")
      }
    }

    // Aplica os efeitos de colisões de objetos, se existirem 
    this.collisor.update()

    // Faz limpeza de objetos destruidos
    for (let i in this.currentEnemies) {
      if (this.currentEnemies[i].dead) {
        this.collisor.removeForCollission(this.currentEnemies[i], "enemy")
      }
    }

    for (let i in this.currentBullets) {
      if (this.currentBullets[i].destroyed) {
        this.collisor.removeForCollission(this.currentBullets[i], "bullet")
      }
    }

  }
}
