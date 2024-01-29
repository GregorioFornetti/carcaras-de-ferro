import { GAME_WIDTH, GAME_HEIGHT } from "./constants.js";

import playerConfigs from "./player/playerConfigs.js";

export default class HUDSTART extends Phaser.Scene {

    init() {
        this.time = 0;
        this.textTime = 0;
    }

    constructor () {
        super({ key: 'HUDSTART', active: true });
        this.RESTART_TEXT = 'PRESS [ENTER] TO PLAY!'
        this.RESTART_TEXT_Y = GAME_HEIGHT - 100
        this.RESTART_TEXT_COLOR = '#ffffff'
        this.RESTART_TEXT_FONT_SIZE = '16px'
        this.RESTART_TEXT_FONT_FAMILY = 'Roboto'
        this.RESTART_TEXT_BLINK_DURATION = 500  // Em milissegundos - Se for 0, não pisca
    }
    
    preload() {
        this.load.video("menu_video","../Artes/menu_video/menu_video.webm");
        //this.load.image("logo","../Artes/<CAMINHO_LOGO>")
    }

    create () {
        const background_video = this.add.video(0,0,"menu_video",true,true);
        // retâgulo preto semi-transparente para escurer o vídeo de background
        const background = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000);
        // stub do logo, depois que pronto precisa colocar aqui 
        const logo_stub = this.add.rectangle(225, 100, GAME_WIDTH/2, 50, 0x0303fc);
        background.setOrigin(0, 0);
        background.alpha = 0.75;
        background_video.setOrigin(0,0);
        background_video.play({loop:true});
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
        this.text.setDepth(1);
        this.input.keyboard.once('keydown-ENTER', () => {
            // fade to black
            this.cameras.main.fadeOut(1500, 0, 0, 0)
        })
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start('GameScene');
            this.scene.start('HUD1');
        })
    }

    update (time, delta) {
        this.textTime += delta
        if (this.textTime >= this.RESTART_TEXT_BLINK_DURATION) {
                this.textTime = 0
                this.text.visible = !this.text.visible
        }
    }

}
