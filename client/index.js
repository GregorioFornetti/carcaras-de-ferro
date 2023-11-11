// Classe de Cena Customizada
/* No Phaser, uma Cena é um objeto que representa uma tela do jogo.
Cada Cena possui um método create() que é chamado quando a cena é criada e um método update() que é chamado a cada frame.
A Cena foi modificada para se conectar a sala do Colyseus e enviar os inputs(inputPayload) do jogador para o servidor.
Nenhum estado do jogo é mantido na Cena, apenas os inputs do jogador são enviados para o servidor que "aceita" esses inputs e atualiza o estado do jogo de todos os jogadores conectados.
*/

//import Phaser from "phaser";
import { EnemyDesavisadosOnAdd, EnemyDesavisadosOnRemove } from "./enemies/EnemyDesavisados.js";
import { GAME_WIDTH, GAME_HEIGHT } from "./constants.js";

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
    }
    this.cursorKeys = null
    this.enemiesEntities = {}
    this.bulletsEntities = {}
  }


  // Carrega os assets a serem utilizados no jogo
  // Aqui serão carregadas as imagens, sons, etc.
  preload() {
    this.cursorKeys = this.input.keyboard.addKeys("W,A,S,D,SPACE")

    this.load.spritesheet('ship_0012', '../Artes/Assets/Ships/ship_0012.png', { frameWidth: 32, frameHeight: 48 });
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

        // Adicione as mudanças aqui
        this.room.state.enemiesDesavisadosSchema.onAdd(EnemyDesavisadosOnAdd.bind(this));
        this.room.state.enemiesDesavisadosSchema.onRemove(EnemyDesavisadosOnRemove.bind(this));
        // Adicione as mudanças aqui
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
            this.playerEntities[sessionId].x = player.x
            this.playerEntities[sessionId].y = player.y
          })
        })

        this.room.state.bulletSchema.onAdd((bullet, sessionId) => {
          this.bulletsEntities[sessionId] = this.physics.add.sprite(
            bullet.x,
            bullet.y,
            "bullet"
          )

          bullet.onChange(() => {
            this.bulletsEntities[sessionId].x = bullet.x
            this.bulletsEntities[sessionId].y = bullet.y
          })
        })

    }
  
  update(time, delta) {
    // Sai do loop se a sala não estiver conectada
    if (!this.room) {
      return
    }

    // envia o input para o servidor com o nome "pressedKeys"
    this.inputPayload.left = this.cursorKeys.A.isDown
    this.inputPayload.right = this.cursorKeys.D.isDown
    this.inputPayload.up = this.cursorKeys.W.isDown
    this.inputPayload.down = this.cursorKeys.S.isDown
    this.inputPayload.shot = this.cursorKeys.SPACE.isDown

    if (
      this.inputPayload.left ||
      this.inputPayload.right ||
      this.inputPayload.up ||
      this.inputPayload.down ||
      this.inputPayload.shot
    ) {
      this.room.send("pressedKeys", this.inputPayload)
    }
  }
}

// Configurações do Phaser gerais
const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#b6d53c',
    parent: 'phaser-example',
    physics: { default: "arcade" },
    pixelArt: true,
    scene: [ GameScene ],
};

// Inicializa o Phaser
const game = new Phaser.Game(config)
