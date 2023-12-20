
import ScoreHUD from "./ScoreHUD.js";

import { GAME_WIDTH, GAME_HEIGHT } from "./constants.js";

import playerConfigs from "./player/playerConfigs.js";


export default class HUD3 extends ScoreHUD {

    constructor () {
        super({ key: 'HUD3', active: true });

        this.FADE_IN_DURATION = 2000;  // Em milissegundos
        this.FADE_IN_FINAL_TRANSPARENCY = 0.7;

        this.PLAYER_SCORE_INITIAL_X = GAME_WIDTH / 4
        this.PLAYER_SCORE_INITIAL_Y = GAME_HEIGHT / 4
        this.GAP_BETWEEN_PLAYERS = 50

        this.PLAYER_SPRITE_SCALE = 1.5

        this.PLAYER_GAP_BETWEEN_SCORE_AND_SPRITE = 40
        
        this.PLAYER_SCORE_GAP_BETWEEN_NUMBERS = 20
        this.PLAYER_SCORE_SCALE = 2
        this.PLAYER_SCORE_EXTRA_Y = 25
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
        let game = this.scene.get('GameScene');
        game.events.on('gameover', (info) => {
            // Fade-in: Adiciona um background preto com transparência crescente
            const background = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000);
            background.setOrigin(0, 0);
            background.alpha = 0;

            this.tweens.add({
                targets: background,
                alpha: this.FADE_IN_FINAL_TRANSPARENCY,
                duration: this.FADE_IN_DURATION,
                ease: 'Linear',
                oncomplete: () => {
                    // Acabou de fazer o fade-in do background escurecido
                    // Logo, podemos mostrar os placares finais

                    let current_y = this.PLAYER_SCORE_INITIAL_Y;

                    for (let i = 0; i < playerConfigs.length; i++) {
                        const currentPlayerInfo = info[`player_${i+1}`];
                        if (currentPlayerInfo) {
                            const playerConfig = playerConfigs[i]

                            const playerImage = this.add.image(
                                this.PLAYER_SCORE_INITIAL_X,
                                current_y,
                                playerConfig.sprite
                            ).setScale(this.PLAYER_SPRITE_SCALE);

                            const playerScore = currentPlayerInfo.score;
                            this.displayScoreLeft(
                                playerScore,
                                this.PLAYER_SCORE_INITIAL_X + this.PLAYER_GAP_BETWEEN_SCORE_AND_SPRITE,
                                current_y + this.PLAYER_SCORE_EXTRA_Y,
                                playerConfig.color,
                                this.PLAYER_SCORE_SCALE,
                                this.PLAYER_SCORE_GAP_BETWEEN_NUMBERS
                            );
                        }
                        current_y += this.GAP_BETWEEN_PLAYERS;
                    }
                }
            });
        });
    }
}
