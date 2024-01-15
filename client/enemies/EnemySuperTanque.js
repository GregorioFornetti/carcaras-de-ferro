import { GAME_HEIGHT } from "../constants.js";
export function EnemySuperTanqueOnAdd(enemy, id) {
	
	let tank = this.physics.add.image(0, 0, 'tile_0120');
	let turret = this.physics.add.image(0, 0, 'tile_0017');
	
	this.enemiesEntities[id] = this.add.container(enemy.x, enemy.y, [tank, turret]);
	
	enemy.onChange(() => {
		this.enemiesEntities[id].setData('serverX', enemy.x);
		this.enemiesEntities[id].setData('serverY', enemy.y);
		
		if (!isNaN(enemy.angle))
			this.enemiesEntities[id].list[1].angle = enemy.angle + 90;
	})
}

export function EnemySuperTanqueOnRemove(enemy, id) {
	if (enemy.y < GAME_HEIGHT) {
		this.somExplosao.play();
		let enemyAnimation = this.physics.add.sprite(enemy.x, enemy.y, "explosao");
		enemyAnimation.anims.create({
			key: "explosao",
			frames: this.anims.generateFrameNumbers("explosao", { start: 0, end: 7 }),
			repeat: 0, // Não se repete, reproduz uma vez
			hideOnComplete: true,
		  });
		enemyAnimation.anims.play("explosao");
	}
	this.enemiesEntities[id].destroy();
	delete this.enemiesEntities[id];
}
