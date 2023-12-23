export function BombaOnAdd(bomba, id) {
    let multiTamanho = 2;

    this.bombasEntities[id] = this.physics.add.sprite(bomba.x, bomba.y, 'bomba');
    this.bombasEntities[id].setScale(multiTamanho);

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
    let animation = this.physics.add.sprite(bomba.x, bomba.y, "explosao_bomba");
    animation.anims.play("explosao_bae");
    
    this.somExplosao.play()
    this.bombasEntities[id].destroy();
}