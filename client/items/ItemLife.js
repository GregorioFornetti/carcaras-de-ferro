export function ItemLifeOnAdd(item, id) {
	this.itemLifeEntities[id] = this.physics.add.image(item.x, item.y, 'item_life');

	item.onChange(() => {
		//this.enemiesEntities[id].y = item.y;
		this.itemLifeEntities[id].setData('serverX', item.x);
		this.itemLifeEntities[id].setData('serverY', item.y);
	})
}

export function ItemLifeOnRemove(item, id) {
  this.itemLifeEntities[id].destroy();
  delete this.itemLifeEntities[id];
}
  
