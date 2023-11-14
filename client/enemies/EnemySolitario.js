export function EnemySolitarioOnAdd(enemy, id) {
	this.enemiesEntities[id] = this.physics.add.image(enemy.x, enemy.y, 'ship_0022');
	//this.enemiesEntities[id] = this.add.rectangle (enemy.x, enemy.y, 32, 32, 0x888888);
	
	enemy.onChange(() => {
		//this.enemiesEntities[id].y = enemy.y;
		
		this.enemiesEntities[id].setData('serverX', enemy.x);
		this.enemiesEntities[id].setData('serverY', enemy.y);
	})
}

export function EnemySolitarioOnRemove(enemy, id) {
	console.log('removendo solitario')
	console.log(id);
	this.enemiesEntities[id].destroy();
}
