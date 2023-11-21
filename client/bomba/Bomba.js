export function BombaOnAdd(bomba, id) {
    this.bombasEntities[id] = this.physics.add.sprite(bomba.x, bomba.y, 'bomba');

    bomba.onChange(() => {
        this.bombasEntities[id].y = bomba.y;
        this.bombasEntities[id].tamanho = bomba.tamanho;
    })
}


export function BombaOnRemove(bomba, id) {
    console.log('removendo bomba')
    console.log(id)
    this.bombasEntities[id].destroy();

    // implementar explosao
}