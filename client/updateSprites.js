export function UpdateSprites () {
	const { scrollY } = this.room.state.bgSchema
	if (scrollY) {
		if (this.layer.y > -50 && scrollY < -3712 + 50 + GAME_HEIGHT) 
			this.layer.y -= 3712 - GAME_HEIGHT;

		this.layer.y = Phaser.Math.Linear(this.layer.y, scrollY, 0.2)
		this.layer2.y = Phaser.Math.Linear(this.layer.y, scrollY, 0.2)
	}
	
	for (let id in this.playerEntities) {
		const entity = this.playerEntities[id];
		const { serverX, serverY } = entity.data.values;

		entity.x = Phaser.Math.Linear(entity.x, serverX, 0.2);
		entity.y = Phaser.Math.Linear(entity.y, serverY, 0.2);
	}

	for (let id in this.bulletsEntities) {
		const entity = this.bulletsEntities[id];
		const { serverX, serverY } = entity.data.values;

		entity.x = Phaser.Math.Linear(entity.x, serverX, 0.2);
		entity.y = Phaser.Math.Linear(entity.y, serverY, 0.2);
	}

	for (let id in this.enemiesEntities) {
		const entity = this.enemiesEntities[id];
		
		const { serverX, serverY } = entity.data.values;

		entity.x = Phaser.Math.Linear(entity.x, serverX, 0.2);
		entity.y = Phaser.Math.Linear(entity.y, serverY, 0.2);
	}
}