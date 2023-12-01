import { GAME_HEIGHT } from "../constants.js";

export function EnemyCombatenteOnAdd(enemy, id) {
	this.enemiesEntities[id] = this.physics.add.sprite(enemy.x, enemy.y, 'ship_0015');
	this.physics.add.existing(this.enemiesEntities[id]);

	enemy.onChange(() => {
		//this.enemiesEntities[id].x = enemy.x;
		//this.enemiesEntities[id].y = enemy.y;
		
		this.enemiesEntities[id].setData('serverX', enemy.x);
		this.enemiesEntities[id].setData('serverY', enemy.y);
	})
}

export function EnemyCombatenteOnRemove(enemy, id) {	
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
