const FORTALEZA_SIZE = 3


export function EnemyFortalezaOnAdd(enemy, id) {
    this.enemiesEntities[id] = this.physics.add.sprite(enemy.x, enemy.y, 'ship_19');
    this.enemiesEntities[id].setScale(FORTALEZA_SIZE);
    this.enemiesEntities[id].angle = 180;

    enemy.onChange(() => {
        this.enemiesEntities[id].setData('serverX', enemy.x);
		this.enemiesEntities[id].setData('serverY', enemy.y);
    })
}


export function EnemyFortalezaOnRemove(enemy, id) {
    this.enemiesEntities[id].destroy();
    delete this.enemiesEntities[id];
}