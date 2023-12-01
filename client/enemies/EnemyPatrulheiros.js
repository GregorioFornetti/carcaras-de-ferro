export function EnemyPatrulheirosOnAdd(enemy, id) {
	this.enemiesEntities[id] = this.physics.add.sprite(enemy.x, enemy.y, 'ship_0023');
	this.physics.add.existing(this.enemiesEntities[id]);

	this.enemiesEntities[id].anims.create({
		key: "explosao",
		frames: this.anims.generateFrameNumbers("explosao", { start: 0, end: 7 }),
		duration: 2000,
		repeat: 0, // Não se repete, reproduz uma vez
	  });

	enemy.onChange(() => {
		//this.enemiesEntities[id].y = enemy.y;
		
		this.enemiesEntities[id].setData('serverX', enemy.x);
		this.enemiesEntities[id].setData('serverY', enemy.y);
	})
}

export function EnemyPatrulheirosOnRemove(enemy, id) {
	/** Animação de destruição do enemy */
	/*
	this.somExplosao.play();
	let enemyAnimation = this.physics.add.sprite(enemy.x, enemy.y, "explosao");
	enemyAnimation.anims.create({
		key: "explosao",
		frames: this.anims.generateFrameNumbers("explosao", { start: 0, end: 7 }),
		repeat: 0, // Não se repete, reproduz uma vez
		hideOnComplete: true,
	  });
	enemyAnimation.anims.play("explosao");
	  */
	this.enemiesEntities[id].destroy();
	delete this.enemiesEntities[id];
}
