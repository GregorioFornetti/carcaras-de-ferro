
export function EnemyRedSquareOnAdd(enemy, id) {
    this.enemiesEntities[id] = this.add.rectangle(enemy.x, enemy.y, 32, 32, 0x000000);

    enemy.onChange(() => {
        this.enemiesEntities[id].fillColor = enemy.color * 256 * 256;
    })
}


export function EnemyRedSquareOnRemove(enemy, id) {
    console.log('removendo vermelho')
    console.log(id)
    this.enemiesEntities[id].destroy();
}