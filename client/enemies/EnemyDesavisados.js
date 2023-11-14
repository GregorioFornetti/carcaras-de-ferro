
export function EnemyDesavisadosOnAdd(enemy, id) {
    this.enemiesEntities[id] = this.physics.add.sprite(enemy.x, enemy.y, 'ship_0022');
    this.physics.add.existing(this.enemiesEntities[id]);
    if (enemy.x <= 0){
        this.enemiesEntities[id].angle = 90;
    } else {
        this.enemiesEntities[id].angle = -90;
    }

    enemy.onChange(() => {
        this.enemiesEntities[id].x = enemy.x;
    })
}


export function EnemyDesavisadosOnRemove(enemy, id) {
    console.log('removendo desavisado')
    console.log(id)
    this.enemiesEntities[id].destroy();
}