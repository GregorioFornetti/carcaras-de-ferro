export function BombaOnAdd(bomba, id) {
    let multiTamanho = 2;

    this.bombasEntities[id] = this.physics.add.sprite(bomba.x, bomba.y, 'bomba');
    this.bombasEntities[id].setScale(multiTamanho);
    this.anims.create({
        key: "explosao_bomba",
        frames: this.anims.generateFrameNumbers(`explosao_bae`, { start: 0, end: 12 }),
        frameRate: 10,
        repeat: 0, 
    });

    bomba.onChange(() => {
        this.bombasEntities[id].y = bomba.y;
        this.bombasEntities[id].tamanho = bomba.tamanho;
        multiTamanho = multiTamanho - 0.06;
        if (multiTamanho < 0.05){
            multiTamanho = 0.05;
        }
        this.bombasEntities[id].setScale(multiTamanho);
    })
}


export function BombaOnRemove(bomba, id) {
    this.anims.play("explosao_bomba");
    this.bombasEntities[id].destroy();

    // implementar explosao


    this.somExplosao.play()
}