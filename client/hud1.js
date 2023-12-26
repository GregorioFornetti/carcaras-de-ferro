
import { GAME_HEIGHT, GAME_WIDTH } from "./constants.js";


export default class HUD1 extends Phaser.Scene {

    constructor () {
        super({ key: 'HUD1', active: true });
        this.score = 0;
    }
    
    preload() {
        // Carregando sprite dos jogadores
        this.load.image('ship_1', './Artes/Assets_Personalizados/Ships/Idle/ship1_idle.png')
        this.load.image('ship_2', './Artes/Assets_Personalizados/Ships/Idle/ship2_idle.png')
        this.load.image('ship_3', './Artes/Assets_Personalizados/Ships/Idle/ship3_idle.png')
        this.load.image('ship_4', './Artes/Assets_Personalizados/Ships/Idle/ship4_idle.png')

        // Carregando sprites dos números (para o placar)
        this.load.image('number_0', './Artes/Assets/Tiles/tile_0019.png')
        this.load.image('number_1', './Artes/Assets/Tiles/tile_0020.png')
        this.load.image('number_2', './Artes/Assets/Tiles/tile_0021.png')
        this.load.image('number_3', './Artes/Assets/Tiles/tile_0022.png')
        this.load.image('number_4', './Artes/Assets/Tiles/tile_0023.png')
        this.load.image('number_5', './Artes/Assets/Tiles/tile_0031.png')
        this.load.image('number_6', './Artes/Assets/Tiles/tile_0032.png')
        this.load.image('number_7', './Artes/Assets/Tiles/tile_0033.png')
        this.load.image('number_8', './Artes/Assets/Tiles/tile_0034.png')
        this.load.image('number_9', './Artes/Assets/Tiles/tile_0035.png')

        //Carregando sprites de vida
        this.load.image('coracao_red', './Artes/Assets_Personalizados/Coracoes/coracao_Padrao1.png')
        this.load.image('coracao_black_up', './Artes/Assets_Personalizados/Coracoes/coracao_Preto_Up1.png')
        this.load.image('coracao_black_down', './Artes/Assets_Personalizados/Coracoes/coracao_Preto_Down1.png')
        
        //Carrgando sprite bomba
        this.load.image('bomba', './Artes/Assets/Tiles/tile_0012.png')

    }

    create () {

        // Variáveis de configuração
        this.shipScoreGap = 25
        this.scoreNumbersGap = 10
        this.scoreScale = 1
        this.scoreYExtra = 10
        this.scoresConfig = [
            {
                sprite: 'ship_2',
                x: 20,
                y: 5,
                flow: 'left',
                color: 0xDE4B1E
            },
            {
                sprite: 'ship_1',
                x: 20,
                y: 35,
                flow: 'left',
                color: 0x679378
            },
            {
                sprite: 'ship_3',
                x: GAME_WIDTH - 25,
                y: 5,
                flow: 'right',
                color: 0x11A5D4
            },
            {
                sprite: 'ship_4',
                x: GAME_WIDTH - 25,
                y: 35,
                flow: 'right',
                color: 0xE2A106
            }
        ]

        this.currentPlayers = {}

        let game = this.scene.get('GameScene');

        game.events.on('newPlayer', function (id) {
            const currentPlayerNumber = Object.keys(this.currentPlayers).length
            this.currentPlayers[id] = {}

            this.currentPlayers[id].image = this.add.image(this.scoresConfig[currentPlayerNumber].x, this.scoresConfig[currentPlayerNumber].y, this.scoresConfig[currentPlayerNumber].sprite).setScale(0.75)

            this.currentPlayers[id].score = 0
            let shipScoreGap = this.shipScoreGap
            if (this.scoresConfig[currentPlayerNumber].flow === 'right') {
                shipScoreGap = -shipScoreGap - 10  // Por algum motivo o texto da direita fica mais para direita por padrão, então tem que compensar
            }
            this.currentPlayers[id].scoreImages = this.displayScore(
                this.currentPlayers[id].score, 
                this.scoresConfig[currentPlayerNumber].x + shipScoreGap, 
                this.scoresConfig[currentPlayerNumber].y + this.scoreYExtra, 
                this.scoresConfig[currentPlayerNumber].flow
            )
  
            this.currentPlayers[id].flow = this.scoresConfig[currentPlayerNumber].flow
            this.currentPlayers[id].color = this.scoresConfig[currentPlayerNumber].color
        }, this);

        game.events.on('playerScoreChange', (id, score) => {
            this.currentPlayers[id].score = score
            for (let i = 0; i < this.currentPlayers[id].scoreImages.length; i++) {
                this.currentPlayers[id].scoreImages[i].destroy()
            }
            let shipScoreGap = this.shipScoreGap
            if (this.currentPlayers[id].flow === 'right') {
                shipScoreGap = -shipScoreGap  // Por algum motivo o texto da direita fica mais para direita por padrão, então tem que compensar
            }

            console.log(this.currentPlayers[id].x + shipScoreGap)
            this.currentPlayers[id].scoreImages = this.displayScore(
                this.currentPlayers[id].score, 
                this.currentPlayers[id].image.x + shipScoreGap, 
                this.currentPlayers[id].image.y + this.scoreYExtra, 
                this.currentPlayers[id].flow,
                this.currentPlayers[id].color
            )
        })

        this.bomb = 2
        this.health = 3

        this.setSpritesAnim(); //define as trocas de sprite vida
       
        this.displayVida = [
            this.add.sprite(15, GAME_HEIGHT - 15, 'coracao_red').setScale(0.5), 
            this.add.sprite(40, GAME_HEIGHT - 15, 'coracao_red').setScale(0.5),
            this.add.sprite(65, GAME_HEIGHT - 15, 'coracao_red').setScale(0.5)]
        
        game.events.on('healthChange', function(health) {
            if(health == -1 && this.health > 0) {
                this.displayVida[this.health-1].play('dano')
                this.health -= 1;
            }
            if(this.health == 0) {
                this.displayVida[1].x +=5
                this.displayVida[2].x +=10
                this.displayVida[0].play('died');
                this.displayVida[1].play('died');
                this.displayVida[2].play('died');
            }
        }, this);
    }

    displayScore(score, x, y, flow, color) {
        if (flow === 'left') {
            return this.displayScoreLeft(score, x, y, color)
        } else if (flow === 'right') {
            return this.displayScoreRight(score, x, y, color)
        }
    }

    displayScoreLeft(score, x, y, color) {
        let scoreString = score.toString()
        let scoreSprites = []
        let scoreSpritesX = x
    
        for (let i = 0; i < scoreString.length; i++) {
            scoreSprites.push(
                this.add.image(scoreSpritesX, y, 'number_' + scoreString[i])
                .setScale(this.scoreScale)
                .setTint(color)
            )
            scoreSpritesX += this.scoreNumbersGap
        }
    
        return scoreSprites
    }
    

    displayScoreRight(score, x, y, color) {
        let scoreString = score.toString()
        let scoreSprites = []
        let scoreSpritesX = x
    
        for (let i = scoreString.length - 1; i >= 0; i--) {
            scoreSprites.push(
                this.add.image(scoreSpritesX, y, 'number_' + scoreString[i])
                .setScale(this.scoreScale)
                .setTint(color)
            )
            scoreSpritesX -= this.scoreNumbersGap
        }
    
        return scoreSprites
    }

    setSpritesAnim() {
        this.anims.create({
            key: 'dano',
            frames: [
                { key: 'coracao_red' },
                { key: 'coracao_black_up' },
            ],
            frameRate: 10,
            repeat: false
        });
        this.anims.create({
            key: 'died',
            frames: [
                { key: 'coracao_black_up' },
                { key: 'coracao_black_down' },
            ],
            frameRate: 10,
            repeat: false
        });
    }
}
