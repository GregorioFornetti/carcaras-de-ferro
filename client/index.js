// Classe de Cena Customizada
/* No Phaser, uma Cena é um objeto que representa uma tela do jogo.
Cada Cena possui um método create() que é chamado quando a cena é criada e um método update() que é chamado a cada frame.
A Cena foi modificada para se conectar a sala do Colyseus e enviar os inputs(inputPayload) do jogador para o servidor.
Nenhum estado do jogo é mantido na Cena, apenas os inputs do jogador são enviados para o servidor que "aceita" esses inputs e atualiza o estado do jogo de todos os jogadores conectados.
*/

//import Phaser from "phaser";
//import { GAME_HEIGHT, GAME_WIDTH } from "./constants.js";
import { EnemyDesavisadosOnAdd, EnemyDesavisadosOnRemove } from "./enemies/EnemyDesavisados.js";
import { GAME_WIDTH, GAME_HEIGHT } from "./constants.js";
import { EnemySolitarioOnAdd, EnemySolitarioOnRemove } from "./enemies/EnemySolitario.js";
import { EnemyPatrulheirosOnAdd, EnemyPatrulheirosOnRemove } from "./enemies/EnemyPatrulheiros.js";
import { EnemyCombatenteOnAdd, EnemyCombatenteOnRemove } from "./enemies/EnemyCombatente.js";
import { EnemyFortalezaOnAdd, EnemyFortalezaOnRemove } from "./enemies/EnemyFortaleza.js";
import { EnemyCacadorOnAdd, EnemyCacadorOnRemove } from "./enemies/EnemyCacador.js";
import { EnemyCruzadorOnAdd, EnemyCruzadorOnRemove } from "./enemies/EnemyCruzador.js";
//import {CollisorPlayerEnemy,CollisorBulletEnemy,CollisorPlayerBullet} from "./enemies/Collisor.js";
import { UpdateSprites } from "./updateSprites.js";
import { BombaOnAdd, BombaOnRemove } from "./bomba/Bomba.js";
import { PlayerOnAdd, PlayerOnRemove } from "./player/Player.js"
import { BulletOnAdd, BulletOnRemove } from "./bullet/Bullet.js"
import HUD1 from "./hud1.js";
import HUD3 from "./hud3.js";
import { createAnimations, playerExplosionAnimation, enemyDamageAnimation} from "./animations/animation.js"

let roomId = null
let oldId = null


export class GameScene extends Phaser.Scene {

  init() {
    this.client = new Colyseus.Client("http://localhost:8080");
    this.elapsedTime = 0;
    this.fixedTimeStep = 1000 / 60; 
    this.room = null
    this.remoteRef = null
    this.currentPlayer = null
    this.movement = {
      up: false, 
      down: false, 
      left: false, 
      right: false,
    }
    this.speedPlayer = 3

    this.playerEntities = {}
    this.bg = null //background (mapa do jogo)
    this.cursorKeys = null
    this.enemiesEntities = {}
    this.bulletsEntities = {}
  
    this.bombasEntities = {}

    //Sons
    this.somDisparoJogador = null;
    this.somExplosao = null;
    this.somDano = null;
    this.danoP = 0;
	
	  this.somDisparoInimigo = null;
  }

  constructor() {
    super("GameScene")
  }

  // Carrega os assets a serem utilizados no jogo
  // Aqui serão carregadas as imagens, sons, etc.
  preload() {

    this.load.image('myMap', './Artes/Mapas/Stub/export/map.png' )
    this.load.spritesheet('ship_0012', '../Artes/Assets/Ships/ship_0012.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('ship_0022', '../Artes/Assets_Personalizados/Ships/Spritesheets/solitario.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('ship_0023', '../Artes/Assets_Personalizados/Ships/Spritesheets/patrulheiro.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('ship_0015', '../Artes/Assets_Personalizados/Ships/Spritesheets/combatente.png', { frameWidth: 64, frameHeight: 64 });
    this.load.audio('disparo2', './Efeitos/Disparos/Disparo2.wav');
    this.load.audio('explosao', './Efeitos/Explosão/Explosão1.wav');
    this.load.audio('explosao_bae', './Efeitos/Explosão/nuclear6.mp3');
    this.load.audio('dano', './Efeitos/Dano/Dano2.wav');

    this.load.spritesheet('ship_1_animado', './Artes/Assets_Personalizados/Ships/Spritesheets/ship2.png', {
      frameWidth: 64,
      frameHeight: 64,
    })
    this.load.spritesheet('ship_2_animado', './Artes/Assets_Personalizados/Ships/Spritesheets/ship1.png', {
      frameWidth: 64,
      frameHeight: 64,
    })
    this.load.spritesheet('ship_3_animado', './Artes/Assets_Personalizados/Ships/Spritesheets/ship3.png', {
      frameWidth: 64,
      frameHeight: 64,
    })
    this.load.spritesheet('ship_4_animado', './Artes/Assets_Personalizados/Ships/Spritesheets/ship4.png', {
      frameWidth: 64,
      frameHeight: 64,
    })
    this.load.spritesheet('explosao', './Artes/Assets_Personalizados/Ships/Spritesheets/ships_Explosao.png', {
      frameWidth: 64,
      frameHeight: 64,
    })

    this.load.spritesheet("ship_19", "../Artes/Assets_Personalizados/Ships/Spritesheets/cacador.png", {
      frameWidth: 64,
      frameHeight: 64,
    })

    this.load.spritesheet("cruzador", "../Artes/Assets_Personalizados/Ships/Spritesheets/cruzador.png", {
      frameWidth: 64,
      frameHeight: 64,
    })

    this.load.spritesheet("explosao_bae", "./Artes/Assets_Personalizados/Ships/Spritesheets/explosao_BAE.png", {
      frameWidth: 128,
      frameHeight: 128,
    })

    this.load.image("bullet", "./Artes/Assets/Tiles/tile_0000.png")
    this.load.spritesheet("bullet_light", "./Artes/Assets_Personalizados/Ships/Spritesheets/muzzle-flashes.png", {
      frameWidth: 8,
      frameHeight: 8,
    })

    this.load.image("bomba", "./Artes/Assets/Tiles/tile_0012.png")

    this.load.on('complete', () => {
      // cria as animações
      createAnimations(this.anims);
    });
  }

  /* Cria os objetos do jogo, além de efetivamente conectar na sala do Colyseus
       Aqui serão defindos os callbacks de eventos do jogo, quando um jogador realizar
       uma ação, será definido um tratamento local para essa ação.
    */
  async create() {
    console.log("Conectando na sala...")
    try {
      if (roomId === null) {
        this.room = await this.client.joinOrCreate("my_room");
        oldId = this.room.sessionId
      } else {
        this.room = await this.client.joinById(roomId, { oldId: oldId });
        oldId = this.room.sessionId
      }
      console.log(`Conectado com sucesso com id de cliente {${this.room.sessionId}}`);

    } catch (e) {
      console.error(e);
    }
    
		
    this.room.state.enemiesSolitarioSchema.onAdd(EnemySolitarioOnAdd.bind(this))
    this.room.state.enemiesSolitarioSchema.onRemove(EnemySolitarioOnRemove.bind(this))

    this.room.state.enemiesPatrulheirosSchema.onAdd(EnemyPatrulheirosOnAdd.bind(this))
    this.room.state.enemiesPatrulheirosSchema.onRemove(EnemyPatrulheirosOnRemove.bind(this))

    this.room.state.enemiesCombatenteSchema.onAdd(EnemyCombatenteOnAdd.bind(this))
    this.room.state.enemiesCombatenteSchema.onRemove(EnemyCombatenteOnRemove.bind(this))

    this.room.state.enemiesDesavisadosSchema.onAdd(EnemyDesavisadosOnAdd.bind(this));
    this.room.state.enemiesDesavisadosSchema.onRemove(EnemyDesavisadosOnRemove.bind(this));

    this.room.state.enemiesFortalezaSchema.onAdd(EnemyFortalezaOnAdd.bind(this));
    this.room.state.enemiesFortalezaSchema.onRemove(EnemyFortalezaOnRemove.bind(this));

    // this.room.state.enemiesCacadorSchema.onAdd(EnemyCacadorOnAdd.bind(this));
    // this.room.state.enemiesCacadorSchema.onRemove(EnemyCacadorOnRemove.bind(this));

    // this.room.state.enemiesCruzadorSchema.onAdd(EnemyCruzadorOnAdd.bind(this));
    // this.room.state.enemiesCruzadorSchema.onRemove(EnemyCruzadorOnRemove.bind(this));

    //** Scroll do Mapa **
    this.room.state.bgSchema.listen(
      "scrollY",
      (currentPosition, previousPosition) => {
        this.bg.setData("scrollY", currentPosition)
      }
    )

    // Player states changes
    this.room.state.playersSchema.onAdd(PlayerOnAdd.bind(this))
    this.room.state.playersSchema.onRemove(PlayerOnRemove.bind(this))

    // Bullet states changes
    this.room.state.bulletSchema.onAdd(BulletOnAdd.bind(this))
    this.room.state.bulletSchema.onRemove(BulletOnRemove.bind(this))

    // Bomba states changes
    this.room.state.bombaSchema.onAdd(BombaOnAdd.bind(this))
    this.room.state.bombaSchema.onRemove(BombaOnRemove.bind(this))

    const width = GAME_WIDTH;
    const height = GAME_HEIGHT;
    this.bg = this.add.tileSprite(width/2, height/2, width, height, 'myMap'); //tileSprite para movimentacao
    //this.flashCamera = this.cameras.add(width/2, height/2, width, height);
    // Sons
    this.somDisparoJogador = this.sound.add('disparo2');
	  this.somDisparoInimigo = this.sound.add('disparo2');
    this.somExplosao = this.sound.add('explosao');
    this.somExplosaoBAE = this.sound.add('explosao_bae');
    this.somDano = this.sound.add('dano');
    //Eventos Input
    this.input.keyboard.on('keydown-M', () => {
      this.room.send("NUKE",{});
    })

    this.input.keyboard.on('keydown-SPACE', () => {
      this.room.send("FIRE",{});
    })
    
    this.input.keyboard.on('keydown-W', () => {
      this.movement.up = true
      this.room.send("UP",{pressed:true});
    })

    this.input.keyboard.on('keyup-W', () => {
      this.movement.up = false
      this.room.send("UP",{pressed:false});
    })

    this.input.keyboard.on('keydown-S', () => {
      this.movement.down = true
      this.room.send("DOWN",{pressed:true});
    })
    
    this.input.keyboard.on('keyup-S', () => {
      this.movement.down = false
      this.room.send("DOWN",{pressed:false});
    })
    
    this.input.keyboard.on('keydown-A', () => {
      this.movement.left = true
      this.room.send("LEFT",{pressed:true});
    })
    
    this.input.keyboard.on('keyup-A', () => {
      this.movement.left = false
      this.room.send("LEFT",{pressed:false});
    })
    
    this.input.keyboard.on('keydown-D', () => {
      this.movement.right = true
      this.room.send("RIGHT",{pressed:true});
    })
    this.input.keyboard.on('keyup-D', () => {
      this.movement.right = false
      this.room.send("RIGHT",{pressed:false});
    })
    this.input.keyboard.on('keydown-ENTER', () => {
      this.room.send("STARTGAME",{});
    })
    
    this.room.onMessage("RESTARTGAME", (newRoomId) => {
      // Recebeu do SERVIDOR que o jogo deve ser reiniciado, então já é um consenso que o jogo deve ser reiniciado
      roomId = newRoomId
      this.room.leave()
      game.destroy()
      document.getElementById("phaser-example").innerHTML = ""
      game = new Phaser.Game(config)
    })

    this.scene.get('HUD3').events.on('ask-restart', () => {
      this.room.send("RESTARTGAME");
    })
  }

  fixedTick(time, delta) {
    // Sai do loop se a sala não estiver conectada

    if (!this.room) {
      return
    }

    if (!this.currentPlayer) { return; }
    const MIN_X = 0
    const MAX_X = GAME_WIDTH
    const MIN_Y = 0
    const MAX_Y = GAME_HEIGHT
    if (this.movement.left) {
      this.currentPlayer.x -= this.speedPlayer * (delta / 1000);
    } else if (this.movement.right) {
      this.currentPlayer.x += this.speedPlayer * (delta / 1000);
    }
    if (this.movement.up) {
      this.currentPlayer.y -= this.speedPlayer * (delta / 1000);
    } else if (this.movement.down) {
      this.currentPlayer.y += this.speedPlayer * (delta / 1000);
    }

    if (this.movement.left) {
      this.currentPlayer.x = Math.max(this.currentPlayer.x - this.speedPlayer, MIN_X)
    } else if (this.movement.right) {
      this.currentPlayer.x = Math.min(this.currentPlayer.x + this.speedPlayer, MAX_X)
    }
    if (this.movement.up) {
      this.currentPlayer.y = Math.max(this.currentPlayer.y - this.speedPlayer, MIN_Y)
    } else if (this.movement.down) {
      this.currentPlayer.y = Math.min(this.currentPlayer.y + this.speedPlayer, MAX_Y)
    }

    const { scrollY } = this.room.state.bgSchema
    if (scrollY) {
      this.bg.tilePositionY = Phaser.Math.Linear(this.bg.tilePositionY, scrollY, 0.2)
    }

    for (let id in this.playerEntities) {
      if (id === this.room.sessionId) continue //pula interpolacao linear do player atual

      const entity = this.playerEntities[id];
      if (entity !== undefined && entity !== null && !entity.dead) {
        const { serverX, serverY, health } = entity.data.values;
        entity.x = Phaser.Math.Linear(entity.x, serverX, 0.2);
        entity.y = Phaser.Math.Linear(entity.y, serverY, 0.2);
        entity.health = health

        if (entity.health === 0) {
          playerExplosionAnimation(this, entity, id)
          entity.dead = true
          entity.on('animationcomplete', () => {
            entity.visible = false
          })
        }
        entity.playerSize = Object.keys(this.playerEntities).length
        const threshold = 2;
        if (entity.x - serverX > threshold) {  // Indo para esquerda
          let animationKey = `ship_esquerda_d${3 - entity.health}_${entity.playerSize}`;
          if (!entity.anims.currentAnim || entity.stoped || entity.anims.currentAnim.key !== animationKey) {
            entity.anims.play(animationKey);
          }
          entity.stoped = false
        } else if (entity.x - serverX < -threshold) { // Indo para direita
          let animationKey = `ship_direita_d${3 - entity.health}_${entity.playerSize}`;
          if (!entity.anims.currentAnim || entity.stoped || entity.anims.currentAnim.key !== animationKey) {
            entity.anims.play(animationKey);
          }
          entity.stoped = false
        } else {
          if (entity.anims.currentAnim && !entity.stoped) {
            let animationKey = entity.anims.currentAnim.key;
            let progress = entity.anims.getProgress();
            if (progress == 1) {
              entity.anims.playReverse(animationKey);
            } else {
              entity.anims.reverse(animationKey);
            }
            entity.stoped = true
          }
        }
      }
    }

    for (let id in this.bulletsEntities) {
      const entity = this.bulletsEntities[id];
      if (entity !== undefined && entity !== null) {
        const { serverX, serverY } = entity.data.values;
        entity.x = Phaser.Math.Linear(entity.x, serverX, 0.2);
        entity.y = Phaser.Math.Linear(entity.y, serverY, 0.2);
      }
    }

    for (let id in this.enemiesEntities) {
      const entity = this.enemiesEntities[id];
      if (entity !== undefined && entity !== null) {
        const { serverX, serverY } = entity.data.values;
        entity.x = Phaser.Math.Linear(entity.x, serverX, 0.2);
        entity.y = Phaser.Math.Linear(entity.y, serverY, 0.2);
      }
    }
  }

  isGameover() {
    for (let id in this.playerEntities) {
      if (this.playerEntities[id].health > 0) {
        return false
      }
    }
    return true
  }

  update(time, delta) {
    if (!this.currentPlayer) { return; }

    this.elapsedTime += delta;
    while (this.elapsedTime >= this.fixedTimeStep) {
        this.elapsedTime -= this.fixedTimeStep;
        this.fixedTick(time, this.fixedTimeStep);
    }
  }
    

  generateGameoverInfo() {
    const info = {}
    for (let id in this.playerEntities) {
      info[`player_${this.playerEntities[id].number}`] = {
        'score': this.playerEntities[id].score,
      }
      
    }
    return info
  }
} 

// Configurações do Phaser gerais
const config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH, // Largura do TileMap
  height: GAME_HEIGHT, //ajusta altura da cena para 80% do interior da janela do browser
  backgroundColor: "#b6d53c",
  parent: "phaser-example",
  physics: {
    default: "arcade",
    fps: 60,
    forceSetTimeOut: true,
  },
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
  },
  scene: [GameScene, HUD1, HUD3],
}

// Inicializa o Phaser
let game = new Phaser.Game(config)
