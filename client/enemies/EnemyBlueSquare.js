
export function EnemyBlueSquareOnAdd(enemy, id) {
    this.enemiesEntities[id] = this.add.rectangle(enemy.x, enemy.y, 32, 32, 0x000000);

    enemy.onChange(() => {
        this.enemiesEntities[id].fillColor = enemy.color;
    })
}


export function EnemyBlueSquareOnRemove(enemy, id) {
    console.log('removendo azul')
    console.log(id)
    this.enemiesEntities[id].destroy();
}