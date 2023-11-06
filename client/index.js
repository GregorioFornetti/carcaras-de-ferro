// Classe de Cena Customizada 
/* No Phaser, uma Cena é um objeto que representa uma tela do jogo.
Cada Cena possui um método create() que é chamado quando a cena é criada e um método update() que é chamado a cada frame.
A Cena foi modificada para se conectar a sala do Colyseus e enviar os inputs(inputPayload) do jogador para o servidor.
Nenhum estado do jogo é mantido na Cena, apenas os inputs do jogador são enviados para o servidor que "aceita" esses inputs e atualiza o estado do jogo de todos os jogadores conectados.
*/

import { EnemySolitarioOnAdd, EnemySolitarioOnRemove } from "./enemies/EnemySolitario.js";
import { EnemyPatrulheirosOnAdd, EnemyPatrulheirosOnRemove } from "./enemies/EnemyPatrulheiros.js";
import { EnemyCombatenteOnAdd, EnemyCombatenteOnRemove } from "./enemies/EnemyCombatente.js";

export class GameScene extends Phaser.Scene {
    constructor() {
        super();
        this.client = new Colyseus.Client("ws://localhost:8080");
        this.room = null;
        this.playerEntities = {};
        this.inputPayload = {
            left: false,
            right: false,
            up: false,
            down: false,
        };
        this.cursorKeys = null;
        this.enemiesEntities = {};
        this.bg = null;
    }

    // Carrega os assets a serem utilizados no jogo
    // Aqui serão carregadas as imagens, sons, etc.
    preload() {
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.load.image('ship_0022', './Artes/Assets/Ships/ship_0022.png');
        this.load.image('ship_0023', './Artes/Assets/Ships/ship_0023.png');
        this.load.image('ship_0015', './Artes/Assets/Ships/ship_0015.png');
    }

    /* Cria os objetos do jogo, além de efetivamente conectar na sala do Colyseus
       Aqui serão defindos os callbacks de eventos do jogo, quando um jogador realizar
       uma ação, será definido um tratamento local para essa ação.
    */
    async create() {
        console.log("Conectando na sala...");

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
        // Adicione as mudanças aqui
    }

    update(time, delta) {
        // Sai do loop se a sala não estiver conectada
        if (!this.room) {
            return; 
        }
  
        // envia o input para o servidor com o nome "0"
        this.inputPayload.left = this.cursorKeys.left.isDown;
        this.inputPayload.right = this.cursorKeys.right.isDown;
        this.inputPayload.up = this.cursorKeys.up.isDown;
        this.inputPayload.down = this.cursorKeys.down.isDown;
        if (this.inputPayload.left || this.inputPayload.right || this.inputPayload.up || this.inputPayload.down) {
            this.room.send(0, this.inputPayload);
        }
    }
}

// Configurações do Phaser gerais
const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 800,
    backgroundColor: '#b6d53c',
    parent: 'phaser-example',
    physics: { default: "arcade" },
    pixelArt: true,
    scene: [ GameScene ],
};

// Inicializa o Phaser
const game = new Phaser.Game(config);
