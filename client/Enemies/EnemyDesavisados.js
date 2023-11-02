
export function EnemyDesavisadosOnAdd(enemy, id) {
    //this.enemiesEntities[id] = this.add.rectangle(enemy.x, enemy.y, 32, 32, 0x808080);
    this.enemiesEntities[id] = this.physics.add.sprite(enemy.x, enemy.y, 'ship_0012');

    enemy.onChange(() => {
        this.enemiesEntities[id].x = enemy.x;
    })
}


export function EnemyDesavisadosOnRemove(enemy, id) {
    console.log('removendo desavisado')
    console.log(id)
    this.enemiesEntities[id].destroy();
}