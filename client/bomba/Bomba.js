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
    console.log('removendo bomba')
    console.log(id)
    this.bombasEntities[id].destroy();

    // implementar explosao


    this.somExplosao.play()
}