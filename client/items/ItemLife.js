import { GAME_WIDTH } from "../constants.js";

export function ItemLifeOnAdd(item, id) {
	this.itemsLifeEntities[id] = this.physics.add.image(item.x, item.y, 'item_life');

	item.onChange(() => {
		this.itemsLifeEntities[id].setData('serverX', item.x);
		this.itemsLifeEntities[id].setData('serverY', item.y);
	})
}

export function ItemLifeOnRemove(item, id) {
	// Verifica se o item foi destruído por ter sido coletado
	const itemHasCollected = item.y < GAME_WIDTH;

	if (itemHasCollected)
		this.events.emit('healthChange', +1)

  this.itemsLifeEntities[id].destroy();
  delete this.itemsLifeEntities[id];
}
  
