export function UpdateSprites () {
	for (let id in this.playerEntities) {
      const entity = this.playerEntities[id];
      if (entity !== undefined && entity !== null) {
        const { serverX, serverY } = entity.data.values;
        entity.x = Phaser.Math.Linear(entity.x, serverX, 0.2);
        entity.y = Phaser.Math.Linear(entity.y, serverY, 0.2);
      }
    }

    for (let id in this.bulletsEntities) {
      const entity = this.bulletsEntities[id];
      if (entity !== undefined && entity !== null) {
        const { serverX, serverY } = entity.data.values;
        entity.x = Phaser.Math.Linear(entity.x, serverX, 0.2);
        entity.y = Phaser.Math.Linear(entity.y, serverY, 0.2);
      }
    }

    for (let id in this.enemiesEntities) {
      const entity = this.enemiesEntities[id];
      if (entity !== undefined && entity !== null) {
        const { serverX, serverY } = entity.data.values;
        entity.x = Phaser.Math.Linear(entity.x, serverX, 0.2);
        entity.y = Phaser.Math.Linear(entity.y, serverY, 0.2);
      }
    }
	
    const { scrollY } = this.room.state.bgSchema;
    if (scrollY) {
      this.bg.tilePositionY = Phaser.Math.Linear(this.bg.tilePositionY, scrollY, 0.2);
    }
}