import { GAME_HEIGHT } from "../constants.js";
export function EnemyTanqueOnAdd(enemy, id) {
	const tank = this.physics.add.image(0, 0, 'tile_0029');
	const turret = this.physics.add.image(0, 0, 'tile_0030');
	
	this.enemiesEntities[id] = this.add.container(enemy.x, enemy.y, [tank, turret]);
	
	this.enemiesEntities[id].list[0].x = 0;
	this.enemiesEntities[id].list[0].y = 0;
	this.enemiesEntities[id].list[1].x = 0;
	this.enemiesEntities[id].list[1].y = 0;
	
	console.log (this.enemiesEntities[id].list);
	
	enemy.onChange(() => {
		this.enemiesEntities[id].setData('serverX', enemy.x);
		this.enemiesEntities[id].setData('serverY', enemy.y);
		this.enemiesEntities[id].list[1].angle = enemy.angle + 90;
		//this.enemiesEntities[id].angle = enemy.angle + 90;
	})
}

export function EnemyTanqueOnRemove(enemy, id) {
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
