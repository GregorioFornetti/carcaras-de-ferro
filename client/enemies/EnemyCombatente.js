export function EnemyCombatenteOnAdd(enemy, id) {
	this.enemiesEntities[id] = this.physics.add.image(enemy.x, enemy.y, 'ship_0015');
	
	enemy.onChange(() => {
		this.enemiesEntities[id].x = enemy.x;
		this.enemiesEntities[id].y = enemy.y;
	})
}

export function EnemyCombatenteOnRemove(enemy, id) {
	console.log('removendo combatente')
	console.log(id);
	this.enemiesEntities[id].destroy();
}
