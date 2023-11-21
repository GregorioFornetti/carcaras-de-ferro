export function EnemyPatrulheirosOnAdd(enemy, id) {
	this.enemiesEntities[id] = this.physics.add.image(enemy.x, enemy.y, 'ship_0023');
	this.physics.add.existing(this.enemiesEntities[id]);
	
	enemy.onChange(() => {
		//this.enemiesEntities[id].y = enemy.y;
		
		this.enemiesEntities[id].setData('serverX', enemy.x);
		this.enemiesEntities[id].setData('serverY', enemy.y);
	})
}

export function EnemyPatrulheirosOnRemove(enemy, id) {
	console.log('removendo patrulheiro')
	console.log(id);
	this.enemiesEntities[id].destroy();
}
