
export function EnemyDesavisadosOnAdd(enemy, id) {
    this.enemiesEntities[id] = this.physics.add.image(enemy.x, enemy.y, 'ship_0012');

    enemy.onChange(() => {
        this.enemiesEntities[id].x = enemy.x;
        this.enemiesEntities[id].y = enemy.y;
    })
}


export function EnemyDesavisadosOnRemove(enemy, id) {
    console.log('removendo desavisado')
    console.log(id)
    this.enemiesEntities[id].destroy();
}