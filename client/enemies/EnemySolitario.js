export function EnemySolitarioOnAdd(enemy, id) {
	this.enemiesEntities[id] = this.add.rectangle(enemy.x, enemy.y, 32, 32, 0x808080);
	
	enemy.onChange(() => {
		this.enemiesEntities[id].y = enemy.y;
	})
}

export function EnemySolitarioOnRemove(enemy, id) {
	console.log('removendo solitario')
	console.log(id);
	this.enemiesEntities[id].destroy();
}
