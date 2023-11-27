const FORTALEZA_SIZE = 3


export function EnemyFortalezaOnAdd(enemy, id) {
    this.enemiesEntities[id] = this.physics.add.sprite(enemy.x, enemy.y, 'ship_19');
    this.enemiesEntities[id].angle = 180;

    enemy.onChange(() => {
        this.enemiesEntities[id].setData('serverX', enemy.x);
		this.enemiesEntities[id].setData('serverY', enemy.y);
    })
}


export function EnemyFortalezaOnRemove(enemy, id) {
    console.log('removendo fortaleza')
    console.log(id)
    this.enemiesEntities[id].destroy();
    delete this.enemiesEntities[id];
}