
import { GAME_WIDTH } from "./constants.js";


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
    }

    create () {

        // Variáveis de configuração
        this.shipScoreGap = 20
        this.scoreNumbersGap = 1
        this.scoreYExtra = 1
        this.scoresConfig = [
            {
                sprite: 'ship_2',
                x: 20,
                y: 5,
                flow: 'left'
            },
            {
                sprite: 'ship_1',
                x: 20,
                y: 35,
                flow: 'left'
            },
            {
                sprite: 'ship_3',
                x: GAME_WIDTH - 25,
                y: 5,
                flow: 'right'
            },
            {
                sprite: 'ship_4',
                x: GAME_WIDTH - 25,
                y: 35,
                flow: 'right'
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
                this.scoresConfig[currentPlayerNumber].flow, 
                this.scoreNumbersGap
            )
  
           
            this.currentPlayers[id].flow = this.scoresConfig[currentPlayerNumber].flow
        }, this);

        game.events.on('playerScoreChange', (id, score) => {
            this.currentPlayers[id].score = score
            for (let i = 0; i < this.currentPlayers[id].scoreImages.length; i++) {
                this.currentPlayers[id].scoreImages[i].destroy()
            }
            this.currentPlayers[id].scoreImages = this.displayScore(
                this.currentPlayers[id].score, 
                this.currentPlayers[id].image.x + this.shipScoreGap, 
                this.currentPlayers[id].image.y + this.scoreYExtra, 
                this.currentPlayers[id].flow, 
                this.scoreNumbersGap
            )
        })
    }

    displayScore(score, x, y, flow, scoreNumbersGap) {
        if (flow === 'left') {
            return this.displayScoreLeft(score, x, y, scoreNumbersGap)
        } else if (flow === 'right') {
            return this.displayScoreRight(score, x, y, scoreNumbersGap)
        }
    }

    displayScoreLeft(score, x, y, scoreNumbersGap) {
        let scoreString = score.toString()
        let scoreSprites = []
        let scoreSpritesX = x
    
        for (let i = 0; i < scoreString.length; i++) {
            scoreSprites.push(this.add.image(scoreSpritesX, y, 'number_' + scoreString[i]).setScale(0.75))
            scoreSpritesX += scoreNumbersGap
        }
    
        return scoreSprites
    }
    

    displayScoreRight(score, x, y, scoreNumbersGap) {
        let scoreString = score.toString()
        let scoreSprites = []
        let scoreSpritesX = x
    
        for (let i = scoreString.length - 1; i >= 0; i--) {
            scoreSprites.push(this.add.image(scoreSpritesX, y, 'number_' + scoreString[i]).setScale(0.75))
            scoreSpritesX -= scoreNumbersGap
        }
    
        return scoreSprites
    }
}
