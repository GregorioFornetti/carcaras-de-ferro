import { GAME_WIDTH } from "../constants.js";

export function ItemBombOnAdd(item, id) {
	this.itemsBombEntities[id] = this.physics.add.image(item.x, item.y, 'item_bomb');

	item.onChange(() => {
		this.itemsBombEntities[id].setData('serverX', item.x);
		this.itemsBombEntities[id].setData('serverY', item.y);
	})
}

export function ItemBombOnRemove(item, id) {
	// Verifica se o item foi destruído por ter sido coletado
	const itemHasCollected = item.y < GAME_WIDTH; 

	if (itemHasCollected) 
		this.events.emit('bombChange', +1)
	
  this.itemsBombEntities[id].destroy();
  delete this.itemsBombEntities[id];
}
  
