export function EnemyPatrulheirosOnAdd(enemy, id) {
	this.enemiesEntities[id] = this.physics.add.image(enemy.x, enemy.y, 'ship_0023');
	
	enemy.onChange(() => {
		this.enemiesEntities[id].y = enemy.y;
	})
}

export function EnemyPatrulheirosOnRemove(enemy, id) {
	console.log('removendo patrulheiro')
	console.log(id);
	this.enemiesEntities[id].destroy();
}
