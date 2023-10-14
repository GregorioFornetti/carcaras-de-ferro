// Classe de Cena Customizada 
/* No Phaser, uma Cena é um objeto que representa uma tela do jogo.
Cada Cena possui um método create() que é chamado quando a cena é criada e um método update() que é chamado a cada frame.
A Cena foi modificada para se conectar a sala do Colyseus e enviar os inputs(inputPayload) do jogador para o servidor.
Nenhum estado do jogo é mantido na Cena, apenas os inputs do jogador são enviados para o servidor que "aceita" esses inputs e atualiza o estado do jogo de todos os jogadores conectados.
*/
export class GameScene extends Phaser.Scene {
    constructor() {
        super();
        this.client = new Colyseus.Client("ws://localhost:2567");
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
    }

    // Carrega os assets a serem utilizados no jogo
    // Aqui serão carregadas as imagens, sons, etc.
    preload() {
        this.cursorKeys = this.input.keyboard.createCursorKeys();
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

        /*Define o que deve acontecer quando a "coleção" tiver um elemento deletado
          Nesse caso, quando um jogador desconectar, 
          o objeto que representa ele no jogo é deletado
        */
        this.room.state.players.onRemove((player, sessionId) => {
            const entity = this.playerEntities[sessionId];
            if (entity) {
                // loga no console a desconexão do jogador
                console.log(`Jogador ${sessionId} desconectado!`);

                // limpando referência local
                delete this.playerEntities[sessionId];
            }
        });

        /* Define o que fazer quando um elemento for adicionado na "coleção"
           Nesse caso, quando um jogador conectar, ele é adicionado em uma estrutura local "playerEntities"
           que é uma referência a uma entidade atualizada pelo servidor
        */ 
        this.room.state.players.onAdd((player, sessionId) => {        
            // listening for server updates
            console.log(`Jogador ${sessionId} conectado!`);
            this.playerEntities[sessionId] = player;
        });

        this.room.state.enemies.onAdd((enemy, id) => {
            this.enemiesEntities[id] = this.add.rectangle(enemy.x, enemy.y, 32, 32, 0x000000);

            enemy.onChange(() => {
                this.enemiesEntities[id].fillColor = enemy.color * 256 * 256;
            })
        })

        this.room.state.enemies.onRemove((enemy, id) => {
            this.enemiesEntities[id].destroy();
        })

        // loga no console a tecla pressionada por outro jogador. Exemplo
        this.room.onStateChange((state) => {
            let estadoTecla = state.players.toJSON();
            for (let i in estadoTecla) {
                if (estadoTecla[i].estadoesquerda == true) {
                    console.log(`O jogador ${i} está no estado esquerda`);
                }
                else if (estadoTecla[i].estadodireita == true) {
                    console.log(`O jogador ${i} está no estado direita`);
                }
                else if (estadoTecla[i].estadobaixo == true) {
                    console.log(`O jogador ${i} está no estado baixo`);
                }
                else if (estadoTecla[i].estadocima == true) {
                    console.log(`O jogador ${i} está no estado cima`);
                }
                else {
                    console.log(`O jogador ${i} está no estado inicial`);
                }
            }
        });
    }

    update(time, delta) {
        // Sai do loop se a sala não estiver conectada
        if (!this.room) {
            return; 
        }
  
        // envia o input para o servidor
        this.inputPayload.left = this.cursorKeys.left.isDown;
        this.inputPayload.right = this.cursorKeys.right.isDown;
        this.inputPayload.up = this.cursorKeys.up.isDown;
        this.inputPayload.down = this.cursorKeys.down.isDown;
        this.inputPayload.space = this.cursorKeys.space.isDown;
        if (this.inputPayload.left || this.inputPayload.right || this.inputPayload.up || this.inputPayload.down) {
            this.room.send(0, this.inputPayload);
        }
    }
}

// Configurações do Phaser gerais
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#b6d53c',
    parent: 'phaser-example',
    physics: { default: "arcade" },
    pixelArt: true,
    scene: [ GameScene ],
};

// Inicializa o Phaser
const game = new Phaser.Game(config);