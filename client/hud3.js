
import ScoreHUD from "./ScoreHUD.js";

import { GAME_WIDTH, GAME_HEIGHT } from "./constants.js";

import playerConfigs from "./player/playerConfigs.js";


export default class HUD3 extends ScoreHUD {

    init() {
        this.isGameover = false
        this.onScoreAnimation = false
        this.animationEnded = false
        this.scoresInfo = []
        this.time = 0
        this.textTime = 0
    }

    constructor () {
        super({ key: 'HUD3', active: true });

        this.DEATH_HEART_SCALE = 0.5
        this.DEATH_HEART_INITIAL_X = 20
        this.DEATH_HEART_INITIAL_Y = GAME_HEIGHT - 20
        this.GAP_BETWEEN_DEATH_HEARTS = 40

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

        this.SCORE_ANIMATION_DURATION = 2000  // Em milissegundos
        this.NEXT_SCORE_ANIMATION_DELAY = 2000  // Em milissegundos

        this.RESTART_TEXT = 'PRESS [ENTER] TO RESTART'
        this.RESTART_TEXT_Y = GAME_HEIGHT - 100
        this.RESTART_TEXT_COLOR = '#ffffff'
        this.RESTART_TEXT_FONT_SIZE = '16px'
        this.RESTART_TEXT_FONT_FAMILY = 'Roboto'
        this.RESTART_TEXT_BLINK_DURATION = 500  // Em milissegundos - Se for 0, não pisca
    }
    
    preload() {
        // Carregando sprite do coração de morte
        this.load.image('death_heart', './Artes/Assets_Personalizados/Coracoes/coracao_Preto_Down1.png')
    }

    create () {
        let game = this.scene.get('GameScene');

        game.events.off('gameover')
        game.events.on('gameover', (info) => {
            this.isGameover = true
            // Fade-in: Adiciona um background preto com transparência crescente
            const background = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000);
            background.setOrigin(0, 0);
            background.alpha = 0;

            this.tweens.add({
                targets: background,
                alpha: this.FADE_IN_FINAL_TRANSPARENCY,
                duration: this.FADE_IN_DURATION,
                ease: 'Linear'
            }).on('complete', () => {
                // Acabou de fazer o fade-in do background escurecido
                // Logo, podemos mostrar os placares finais

                let current_y = this.PLAYER_SCORE_INITIAL_Y;
                let total_score = 0
                for (let i = 0; i < playerConfigs.length; i++) {
                    const currentPlayerInfo = info[`player_${i+1}`];
                    if (currentPlayerInfo) {
                        const playerConfig = playerConfigs[i]

                        this.add.image(
                            this.PLAYER_SCORE_INITIAL_X,
                            current_y,
                            playerConfig.sprite
                        ).setScale(this.PLAYER_SPRITE_SCALE);

                        const playerScore = currentPlayerInfo.score;
                        let scoreSprites = this.displayScoreLeft(
                            0,
                            this.PLAYER_SCORE_INITIAL_X + this.PLAYER_GAP_BETWEEN_SCORE_AND_SPRITE,
                            current_y + this.PLAYER_SCORE_EXTRA_Y,
                            playerConfig.color,
                            this.PLAYER_SCORE_SCALE,
                            this.PLAYER_SCORE_GAP_BETWEEN_NUMBERS
                        );
                        total_score += playerScore;

                        this.scoresInfo.push({
                            x: this.PLAYER_SCORE_INITIAL_X,
                            y: current_y,
                            sprites: scoreSprites,
                            color: playerConfig.color,
                            score: playerScore
                        });
                        current_y += this.GAP_BETWEEN_PLAYERS;
                    }
                }

                let totalText = this.add.text(
                    this.PLAYER_SCORE_INITIAL_X - 50,
                    current_y + 12,
                    'TOTAL',
                    {
                        fontFamily: 'Roboto',
                        fontSize: '24px'
                    }
                );

                let scoreSprites = this.displayScoreLeft(
                    0,
                    this.PLAYER_SCORE_INITIAL_X + this.PLAYER_GAP_BETWEEN_SCORE_AND_SPRITE,
                    current_y + this.PLAYER_SCORE_EXTRA_Y,
                    0xFFFFFF,
                    this.PLAYER_SCORE_SCALE,
                    this.PLAYER_SCORE_GAP_BETWEEN_NUMBERS
                );

                this.scoresInfo.push({
                    x: this.PLAYER_SCORE_INITIAL_X,
                    y: current_y,
                    sprites: scoreSprites,
                    color: 0xFFFFFF,
                    score: total_score
                });

                this.text = this.add.text(
                    0, 
                    this.RESTART_TEXT_Y, 
                    this.RESTART_TEXT, {
                        fontFamily: this.RESTART_TEXT_FONT_FAMILY,
                        fontSize: this.RESTART_TEXT_FONT_SIZE,
                        color: this.RESTART_TEXT_COLOR,
                        align: 'center',
                        fixedWidth: GAME_WIDTH,
                    }
                );
                this.text.visible = false;

                this.onScoreAnimation = true
            })
        });

        game.events.off('ask-restart')
        this.input.keyboard.on('keydown-ENTER', () => {
            if (this.isGameover && this.animationEnded) {
                this.events.emit('ask-restart')
            }
        })

        /*
        game.events.off('current-player-died')
        game.events.on('current-player-died', () => {
            for (let i = 0; i < 3; i++) {
                this.add.image(
                    this.DEATH_HEART_INITIAL_X + i * this.GAP_BETWEEN_DEATH_HEARTS,
                    this.DEATH_HEART_INITIAL_Y,
                    'death_heart'
                ).setScale(this.DEATH_HEART_SCALE)
            }
        })
        */
    }

    update (time, delta) {
        // Código para animar os placares
        // Eles irão crescer de 0 até o valor final do score do jogador
        if (this.isGameover && this.onScoreAnimation) {
            this.time += delta

            for (let i = 0; i < this.scoresInfo.length; i++) {
                let scoreInfo = this.scoresInfo[i]

                let score = scoreInfo.score
                let scoreSprites = scoreInfo.sprites
                let color = scoreInfo.color
                let x = scoreInfo.x
                let y = scoreInfo.y

                for (let sprite of scoreSprites) {
                    sprite.destroy()
                }

                let scoreAnimationProgress = 0
                if (this.ALL_SCORES_ANIMATIONS_IN_THE_SAME_TIME) {
                    scoreAnimationProgress = Math.min(this.time / this.SCORE_ANIMATION_DURATION, 1)
                } else {
                    scoreAnimationProgress = Math.min((this.time - i * this.NEXT_SCORE_ANIMATION_DELAY) / this.SCORE_ANIMATION_DURATION, 1)
                    scoreAnimationProgress = Math.max(scoreAnimationProgress, 0)
                }

                let scoreAnimation = Math.floor(score * scoreAnimationProgress).toString()
                scoreSprites = this.displayScoreLeft(
                    scoreAnimation,
                    x + this.PLAYER_GAP_BETWEEN_SCORE_AND_SPRITE,
                    y + this.PLAYER_SCORE_EXTRA_Y,
                    color,
                    this.PLAYER_SCORE_SCALE,
                    this.PLAYER_SCORE_GAP_BETWEEN_NUMBERS
                )

                this.scoresInfo[i].sprites = scoreSprites
            }

            if (this.time >= this.SCORE_ANIMATION_DURATION + this.NEXT_SCORE_ANIMATION_DELAY * (this.scoresInfo.length - 1)) {
                this.onScoreAnimation = false
                this.animationEnded = true
            }
        }

        // Quando a animação acabar, pisca o texto de restart
        if (this.animationEnded) {
            this.textTime += delta
            if (this.textTime >= this.RESTART_TEXT_BLINK_DURATION) {
                this.textTime = 0
                this.text.visible = !this.text.visible
            }
        }
    }
}
