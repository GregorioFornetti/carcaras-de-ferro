import { GAME_HEIGHT } from "../../constants.js";

let itemId = 0; 

export class Item {
  init(itemsState, ItemSchema, x, y) {
    this.itemAttributes = new ItemSchema();
    this.itemsState = itemsState;
    this.id = itemId++;
    this.itemsState.set(this.id, this.itemAttributes);
    this.width = 16
    this.height = 16
    this.destroyed = false;
  }

  update(deltaTime) {
    this.itemAttributes.y += this.speed * (deltaTime / 1000);
		
		if (this.itemAttributes.y > (GAME_HEIGHT))
			this.destroy();
  }

  destroy() {
    if (this.destroyed) {
      return
    }
    
    this.itemsState.delete(this.id.toString());
    this.destroyed = true
  }
}