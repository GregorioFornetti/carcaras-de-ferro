
import { GAME_WIDTH } from "./constants.js";

import ScoreHUD from "./ScoreHUD.js";

import playerConfigs from "./player/playerConfigs.js";

export default class HUD1 extends ScoreHUD {

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
        this.shipScoreGap = 25
        this.scoreNumbersGap = 10
        this.scoreScale = 1
        this.scoreYExtra = 10
        this.scoresConfig = [
            {
                ...playerConfigs[0],
                x: 20,
                y: 5,
                flow: 'left',
            },
            {
                ...playerConfigs[1],
                x: 20,
                y: 35,
                flow: 'left'
            },
            {
                ...playerConfigs[2],
                x: GAME_WIDTH - 25,
                y: 5,
                flow: 'right'
            },
            {
                ...playerConfigs[3],
                x: GAME_WIDTH - 25,
                y: 35,
                flow: 'right',
            }
        ]

        this.currentPlayers = {}

        let game = this.scene.get('GameScene');

        game.events.off('newPlayer')  // Para não ficar com vários listeners ao resetar o jogo
        game.events.on('newPlayer', function (id) {
            console.log('NOVO PLAYER')
            console.log(id)
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
                this.scoresConfig[currentPlayerNumber].color,
                this.scoreScale,
                this.scoreNumbersGap
            )
  
            this.currentPlayers[id].flow = this.scoresConfig[currentPlayerNumber].flow
            this.currentPlayers[id].color = this.scoresConfig[currentPlayerNumber].color
        }, this);

        game.events.off('playerDied')  // Para não ficar com vários listeners ao resetar o jogo
        game.events.on('playerScoreChange', (id, score) => {
            this.currentPlayers[id].score = score
            for (let i = 0; i < this.currentPlayers[id].scoreImages.length; i++) {
                this.currentPlayers[id].scoreImages[i].destroy()
            }
            let shipScoreGap = this.shipScoreGap
            if (this.currentPlayers[id].flow === 'right') {
                shipScoreGap = -shipScoreGap  // Por algum motivo o texto da direita fica mais para direita por padrão, então tem que compensar
            }

            this.currentPlayers[id].scoreImages = this.displayScore(
                this.currentPlayers[id].score, 
                this.currentPlayers[id].image.x + shipScoreGap, 
                this.currentPlayers[id].image.y + this.scoreYExtra, 
                this.currentPlayers[id].flow,
                this.currentPlayers[id].color,
                this.scoreScale,
                this.scoreNumbersGap
            )
        })
    }
}
