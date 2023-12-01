import { GAME_HEIGHT, GAME_WIDTH } from "../constants.js";

export function EnemyDesavisadosOnAdd(enemy, id) {
    this.enemiesEntities[id] = this.physics.add.sprite(enemy.x, enemy.y, 'ship_0022');
    this.physics.add.existing(this.enemiesEntities[id]);
    if (enemy.x <= 0){
        this.enemiesEntities[id].angle = 90;
    } else {
        this.enemiesEntities[id].angle = -90;
    }

    enemy.onChange(() => {
        //this.enemiesEntities[id].x = enemy.x;
		
		this.enemiesEntities[id].setData('serverX', enemy.x);
		this.enemiesEntities[id].setData('serverY', enemy.y);
    })
}


export function EnemyDesavisadosOnRemove(enemy, id) {
	if (enemy.x >= GAME_WIDTH && enemy.x <= GAME_WIDTH) {
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