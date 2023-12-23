export const createPlayerAnimations = (anims) => {
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
    anims.create({
            key: "explosao",
            frames: anims.generateFrameNumbers("explosao", { start: 0, end: 7 }),
            frameRate: 10,
            repeat: 0,
            hideOnComplete: true,
        });
};
export const createEnemyAnimations = (anims) => {
    anims.create({
        key: "explosao",
        frames: anims.generateFrameNumbers("explosao", { start: 0, end: 7 }),
        frameRate: 10,
        repeat: 0,
        hideOnComplete: true,
    });
}

export function explosionAnimation(scene, obj, id) {
    console.log(obj.health)
    if(obj.health == 0) {
        let animation = scene.physics.add.sprite(obj.x, obj.y, "explosao");
        scene.somExplosao.play();
        animation.anims.play("explosao");
    } else return;
}


