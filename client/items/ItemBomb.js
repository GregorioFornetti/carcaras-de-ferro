export function ItemBombOnAdd(item, id) {
	this.itemBombEntities[id] = this.physics.add.image(item.x, item.y, 'item_bomb');

	item.onChange(() => {
		//this.enemiesEntities[id].y = item.y;
		this.itemBombEntities[id].setData('serverX', item.x);
		this.itemBombEntities[id].setData('serverY', item.y);
	})
}

export function ItemBombOnRemove(item, id) {
  this.itemBombEntities[id].destroy();
  delete this.itemBombEntities[id];
}
  
