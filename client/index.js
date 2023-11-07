// Classe de Cena Customizada 
/* No Phaser, uma Cena é um objeto que representa uma tela do jogo.
Cada Cena possui um método create() que é chamado quando a cena é criada e um método update() que é chamado a cada frame.
A Cena foi modificada para se conectar a sala do Colyseus e enviar os inputs(inputPayload) do jogador para o servidor.
Nenhum estado do jogo é mantido na Cena, apenas os inputs do jogador são enviados para o servidor que "aceita" esses inputs e atualiza o estado do jogo de todos os jogadores conectados.
*/

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
        this.bg = null; //background (mapa do jogo)
    }

    // Carrega os assets a serem utilizados no jogo
    // Aqui serão carregadas as imagens, sons, etc.
    preload() {
        this.cursorKeys = this.input.keyboard.createCursorKeys();

        // Carrega mapa em png
        this.load.image('myMap', './Artes/Mapas/Stub/export/map.png' )
        
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

        // Adicione as mudanças aqui
        
        const width = this.game.config.width;
        const height = this.game.config.height;
        this.bg = this.add.tileSprite(width/2, height/2, width, height, 'myMap'); //tileSprite para movimentacao
        
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

        //** Scroll do Mapa **
        //const receivedBackgroundSchema = this.room.state.bgSchema.scrollY;
        //this.bg.tilePositionY -= 

    }
}

// Configurações do Phaser gerais
const config = {
    type: Phaser.AUTO,
    width: 448, // Largura do TileMap
    height: 512, //ajusta altura da cena para 80% do interior da janela do browser
    backgroundColor: '#b6d53c',
    parent: 'phaser-example',
    physics: { default: "arcade" },
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    },
    scene: [ GameScene ],
};

// Inicializa o Phaser
const game = new Phaser.Game(config);