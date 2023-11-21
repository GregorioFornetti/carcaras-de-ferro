// Classe de Cena Customizada
/* No Phaser, uma Cena é um objeto que representa uma tela do jogo.
Cada Cena possui um método create() que é chamado quando a cena é criada e um método update() que é chamado a cada frame.
A Cena foi modificada para se conectar a sala do Colyseus e enviar os inputs(inputPayload) do jogador para o servidor.
Nenhum estado do jogo é mantido na Cena, apenas os inputs do jogador são enviados para o servidor que "aceita" esses inputs e atualiza o estado do jogo de todos os jogadores conectados.
*/

//import Phaser from "phaser";
import { EnemyDesavisadosOnAdd, EnemyDesavisadosOnRemove } from "./enemies/EnemyDesavisados.js";
import { GAME_WIDTH, GAME_HEIGHT } from "./constants.js";
import { EnemySolitarioOnAdd, EnemySolitarioOnRemove } from "./enemies/EnemySolitario.js";
import { EnemyPatrulheirosOnAdd, EnemyPatrulheirosOnRemove } from "./enemies/EnemyPatrulheiros.js";
import { EnemyCombatenteOnAdd, EnemyCombatenteOnRemove } from "./enemies/EnemyCombatente.js";
import { UpdateSprites } from "./updateSprites.js";
import { BombaOnAdd, BombaOnRemove } from "./bomba/Bomba.js";

export class GameScene extends Phaser.Scene {
  constructor() {
    super()
    this.client = new Colyseus.Client("ws://localhost:8080")
    this.room = null
    this.playerEntities = {}
    this.inputPayload = {
      left: false,
      right: false,
      up: false,
      down: false,
      shot: false,
      explosion: false, // simular som da explosão 
      dano: false, // simular som do dano 
      nuke: false
    }
    this.bg = null; //background (mapa do jogo)
    this.cursorKeys = null
    this.enemiesEntities = {}
    this.bulletsEntities = {}
    this.bombasEntities = {}

    //Sons
    this.somDisparoJogador = null;
    this.somExplosao = null;
    this.somDano = null;
  }


  // Carrega os assets a serem utilizados no jogo
  // Aqui serão carregadas as imagens, sons, etc.
  preload() {
    this.cursorKeys = this.input.keyboard.addKeys("W,A,S,D,SPACE,M,E,R") //simulação - > E (explosão), R (Dano)

    this.load.image('myMap', './Artes/Mapas/Stub/export/map.png' )
    this.load.spritesheet('ship_0012', '../Artes/Assets/Ships/ship_0012.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('ship_0022', '../Artes/Assets/Ships/ship_0022.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('ship_0023', './Artes/Assets/Ships/ship_0023.png');
    this.load.image('ship_0015', './Artes/Assets/Ships/ship_0015.png');
    this.load.audio('disparo2', './Efeitos/Disparos/Disparo2.wav');
    this.load.audio('explosao', './Efeitos/Explosão/Explosão1.wav');
    this.load.audio('dano', './Efeitos/Dano/Dano2.wav');

    
    this.load.spritesheet("ship_1", "./Artes/Assets/Ships/ship_0001.png", {
      frameWidth: 32,
      frameHeight: 48,
    })

    this.load.spritesheet("ship_2", "./Artes/Assets/Ships/ship_0002.png", {
      frameWidth: 32,
      frameHeight: 48,
    })

    this.load.spritesheet("ship_3", "./Artes/Assets/Ships/ship_0003.png", {
      frameWidth: 32,
      frameHeight: 48,
    })

    this.load.spritesheet("ship_4", "./Artes/Assets/Ships/ship_0004.png", {
      frameWidth: 32,
      frameHeight: 48,
    })

    this.load.image("bullet", "./Artes/Assets/Tiles/tile_0000.png")

    this.load.image("bomba", "./Artes/Assets/Tiles/tile_0012.png")
  }

  /* Cria os objetos do jogo, além de efetivamente conectar na sala do Colyseus
       Aqui serão defindos os callbacks de eventos do jogo, quando um jogador realizar
       uma ação, será definido um tratamento local para essa ação.
    */
  async create() {
    console.log("Conectando na sala...")
        try {
            this.room = await this.client.joinOrCreate("my_room");
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

    this.room.state.playersSchema.onRemove((player, sessionId) => {
      const entity = this.playerEntities[sessionId]
      if (entity) {
        // loga no console a desconexão do jogador
        console.log(`Jogador ${sessionId} desconectado!`)

        // limpando referência local
        delete this.playerEntities[sessionId]
      }
    })

    this.room.state.playersSchema.onAdd((player, sessionId) => {
      let playersSize = Object.keys(this.playerEntities).length

      this.playerEntities[sessionId] = this.physics.add.sprite(
        player.x + playersSize * 100,
        player.y + playersSize * 100,
        `ship_${playersSize + 1}`
      )

      player.onChange(() => {
		//this.playerEntities[sessionId].x = player.x
		//this.playerEntities[sessionId].y = player.y
		
		this.playerEntities[sessionId].setData('serverX', player.x);
		this.playerEntities[sessionId].setData('serverY', player.y);
      })
    })

    this.room.state.bulletSchema.onAdd((bullet, sessionId) => {
      this.bulletsEntities[sessionId] = this.physics.add.sprite(
        bullet.x,
        bullet.y,
        "bullet"
      )

      bullet.onChange(() => {
		//this.bulletsEntities[sessionId].x = bullet.x
		//this.bulletsEntities[sessionId].y = bullet.y
		
		this.bulletsEntities[sessionId].setData('serverX', bullet.x);
		this.bulletsEntities[sessionId].setData('serverY', bullet.y);
      })
    })

    this.room.state.bombaSchema.onAdd(BombaOnAdd.bind(this))
    this.room.state.bombaSchema.onRemove(BombaOnRemove.bind(this))

    const width = GAME_WIDTH;
    const height = GAME_HEIGHT;
    this.bg = this.add.tileSprite(width/2, height/2, width, height, 'myMap'); //tileSprite para movimentacao

    // Sons
    this.somDisparoJogador = this.sound.add('disparo2');
    this.somExplosao = this.sound.add('explosao');
    this.somDano = this.sound.add('dano');

  }
  
  update(time, delta) {
    // Sai do loop se a sala não estiver conectada
    if (!this.room) {
      return
    }
	
	for (let id in this.playerEntities) {
		const entity = this.playerEntities[id];
		const { serverX, serverY } = entity.data.values;
		
		if (entity.data === undefined)
			continue;
		
		entity.x = Phaser.Math.Linear(entity.x, serverX, 0.2);
		entity.y = Phaser.Math.Linear(entity.y, serverY, 0.2);
	}

	for (let id in this.bulletsEntities) {
		const entity = this.bulletsEntities[id];
		const { serverX, serverY } = entity.data.values;
		
		if (entity.data === undefined)
			continue;
		
		entity.x = Phaser.Math.Linear(entity.x, serverX, 0.2);
		entity.y = Phaser.Math.Linear(entity.y, serverY, 0.2);
	}

	for (let id in this.enemiesEntities) {
		const entity = this.enemiesEntities[id];
		
		if (entity.data === undefined)
			continue;
		
		const { serverX, serverY } = entity.data.values;

		entity.x = Phaser.Math.Linear(entity.x, serverX, 0.2);
		entity.y = Phaser.Math.Linear(entity.y, serverY, 0.2);
	}
	
    //** Scroll do Mapa **
    this.room.state.bgSchema.listen("scrollY", (currentPosition, previousPosition) => {
      this.bg.tilePositionY = currentPosition;
    });

    // envia o input para o servidor com o nome "pressedKeys"
    this.inputPayload.left = this.cursorKeys.A.isDown
    this.inputPayload.right = this.cursorKeys.D.isDown
    this.inputPayload.up = this.cursorKeys.W.isDown
    this.inputPayload.down = this.cursorKeys.S.isDown
    this.inputPayload.shot = this.cursorKeys.SPACE.isDown
    this.inputPayload.nuke = this.cursorKeys.M.isDown

    //simulação sons
    this.inputPayload.explosion = this.cursorKeys.E.isDown
    this.inputPayload.dano = this.cursorKeys.R.isDown
    if(this.inputPayload.explosion) this.somExplosao.play(); //simulação som explosão E
    if(this.inputPayload.dano) this.somDano.play(); //simulação som dano R

    if (
      this.inputPayload.left ||
      this.inputPayload.right ||
      this.inputPayload.up ||
      this.inputPayload.down ||
      this.inputPayload.shot ||
      this.inputPayload.nuke
    ) {
      if(this.inputPayload.shot) this.somDisparoJogador.play();
      this.room.send("pressedKeys", this.inputPayload)
    }

    
  }
}

// Configurações do Phaser gerais
const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH, // Largura do TileMap
    height: GAME_HEIGHT, //ajusta altura da cena para 80% do interior da janela do browser
    backgroundColor: '#b6d53c',
    parent: 'phaser-example',
    physics: { 
      default: "arcade",
      fps: 60,
      forceSetTimeOut: true
    },
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    },
    scene: [ GameScene ],
};

// Inicializa o Phaser
const game = new Phaser.Game(config)