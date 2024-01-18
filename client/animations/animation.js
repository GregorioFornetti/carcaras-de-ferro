/** Função que cria todas as animações do jogo */
import { GAME_HEIGHT, GAME_WIDTH } from "../constants.js";
export const createAnimations = (anims) => {
    /** Animações da movimentação Player */
    // d0 = sem dano
    // d1 = tomou 1° dano
    // d2 = tomou 2° dano = explosão

    for (let i = 0; i < 3; i++) {
        for (let x = 1; x < 4; x++) {
            const animationKey = `ship_frente_d${i}_${x}`;
            const frameIndex = i * 8;
            anims.create({
                key: animationKey,
                frames: [{ key: `ship_${x}_animado`, frame: frameIndex }],
                frameRate: 10,
            });
        }
    }

    for (let i = 0; i < 3; i++) {
        for (let x = 1; x < 4; x++) {
            const animationKey = `ship_direita_d${i}_${x}`;
            const frameRange = { start: i * 8, end: i * 8 + 3 };
            anims.create({
                key: animationKey,
                frames: anims.generateFrameNumbers(`ship_${x}_animado`, frameRange),
                frameRate: 10,
                repeat: 0,
            });
        }
    }

    for (let i = 0; i < 3; i++) {
        for (let x = 1; x < 4; x++) {
            const animationKey = `ship_esquerda_d${i}_${x}`;
            const frameRange = { start: i * 8 + 4, end: i * 8 + 7 };
            anims.create({
                key: animationKey,
                frames: anims.generateFrameNumbers(`ship_${x}_animado`, frameRange),
                frameRate: 10,
                repeat: 0,
            });
        }
    }

    /** Criação das animações de explosão */
    anims.create({
            key: "explosao",
            frames: anims.generateFrameNumbers("explosao", { start: 0, end: 7 }),
            frameRate: 10,
            repeat: 0,
            hideOnComplete: true,
        });
        anims.create({
            key: "explosao_bae",
            frames: anims.generateFrameNumbers(`explosao_bae`, { start: 0, end: 12 }),
            frameRate: 10,
            repeat: 0, 
            hideOnComplete: true,
        });
    anims.create({
        key: 'light',
        frames: anims.generateFrameNumbers('bullet_light', { frames: [ 3 ] }),
        frameRate: 10,
        hideOnComplete: true,
    }); 
};


/** Função que executa a animação de explosão player (health == 0)*/
export function playerExplosionAnimation(scene, obj, id) {
    if(obj.health == 0) {
        scene.somExplosao.play();
        obj.anims.play("explosao");
    } else return;
}
/** Função que executa a animação de explosão enemy (health == 0)*/
export function enemyExplosionAnimation(scene, obj, id) {
    //if(obj.health == 0) {
    if(obj.y < GAME_HEIGHT && obj.x < GAME_WIDTH - 10) {
        let animation = scene.physics.add.sprite(obj.x, obj.y, "explosao");
        scene.somExplosao.play();
        animation.anims.play("explosao");
    } else return;
}

export function bulletLight(entity, bullet, id) {
    entity.physics.add.sprite(
        bullet.x,
        bullet.y+5,
        'bullet_light',
    ).setScale(3).play('light')
}

/** Função que executa a animação do Enemy ao receber dano (efeito vermelho) */
export function enemyDamageAnimation(scene, enemy) {
    scene.tweens.add({
        targets: enemy,
        duration: 200,
        repeat: 0,
        yoyo: false,
        hideOnComplete: false,
        onStart: function() { this.targets[0].setTint(0xff0000);},
        onComplete: function() { this.targets[0].clearTint(); }
    });
}
/** Função que executa a animação do Player ao receber dano (mudança de sprite, som e efeito piscando) */
export function playerDamageAnimation(player, id) {
    let playersSize = Object.keys(this.playerEntities).length
    let tweenAnimation = `ship_frente_d${3-this.playerEntities[id].data.values.health}_${playersSize+1}`;
      this.somDano.play()
      this.tweens.add({
        targets: this.playerEntities[id],
        alpha: 0,
        duration: 300,
        repeat: 4,
        yoyo: true,
        onStart: function() { this.targets[0].setTint(0xff0000); this.targets[0].anims.play(tweenAnimation); },
        onComplete: function() { this.targets[0].clearTint(); }
    });
}



