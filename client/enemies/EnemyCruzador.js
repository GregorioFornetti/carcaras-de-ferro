import { GAME_HEIGHT, GAME_WIDTH } from "../constants.js";


export function EnemyCruzadorOnAdd(enemy, id) {
    this.enemiesEntities[id] = this.physics.add.sprite(enemy.x, enemy.y, 'ship_19');
    this.enemiesEntities[id].angle = enemy.angle;

    enemy.onChange(() => {
        this.enemiesEntities[id].setData('serverX', enemy.x);
		this.enemiesEntities[id].setData('serverY', enemy.y);
    })
}


export function EnemyCruzadorOnRemove(enemy, id) {
	if (enemy.y < GAME_HEIGHT-30) {
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