
import ScoreHUD from "./ScoreHUD.js";

import { GAME_WIDTH, GAME_HEIGHT } from "./constants.js";


export default class HUD3 extends ScoreHUD {

    constructor () {
        super({ key: 'HUD3', active: true });
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
            console.log('oiiiiii')
            // Fade-in: Adiciona um background preto com transparência crescente
            const background = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000);
            background.setOrigin(0, 0);
            background.alpha = 0;

            this.tweens.add({
                targets: background,
                alpha: 0.7,
                duration: 2000,
                ease: 'Linear',
                
            });
        });
    }
}
