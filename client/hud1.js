
import { GAME_WIDTH } from "./constants.js";


export default class HUD1 extends Phaser.Scene {

    constructor () {
        super({ key: 'HUD1', active: true });
        this.score = 0;
    }
    
    preload() {
        this.load.image('ship_1', './Artes/Assets_Personalizados/Ships/Idle/ship1_idle.png')
        this.load.image('ship_2', './Artes/Assets_Personalizados/Ships/Idle/ship2_idle.png')
        this.load.image('ship_3', './Artes/Assets_Personalizados/Ships/Idle/ship3_idle.png')
        this.load.image('ship_4', './Artes/Assets_Personalizados/Ships/Idle/ship4_idle.png')
    }

    create () {

        this.shipScoreGap = 20
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
        //  Grab a reference to the Game Scene
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
            this.currentPlayers[id].scoreText = this.add.text(
                this.scoresConfig[currentPlayerNumber].x + shipScoreGap,
                this.scoresConfig[currentPlayerNumber].y + this.scoreYExtra,
                this.currentPlayers[id].score, 
                { fontFamily: 'Arial', fontSize: 20, color: '#000000' }
            )
  
           
            this.currentPlayers[id].flow = this.scoresConfig[currentPlayerNumber].flow
        }, this);

        game.events.on('playerScoreChange', (id, score) => {
            this.currentPlayers[id].score = score
            this.currentPlayers[id].scoreText.setText(this.currentPlayers[id].score)
        })
    }
}