import * as schema from "@colyseus/schema";
import { Item } from "./Item.js";

export class ItemBombSchema extends schema.Schema {}

schema.defineTypes(ItemBombSchema, {
  x: "number",
  y: "number"
});

export class ItemBomb extends Item {
  constructor(roomState, x, y) {
    super();
    this.init(roomState.itemBombSchema, ItemBombSchema, x, y);
    this.speed = 100;
  }

  static spawn(roomState, x, y) {	
		const itemBomb = new ItemBomb(roomState, x, y);
		itemBomb.itemAttributes.x = x;
		itemBomb.itemAttributes.y = y;
		
		return itemBomb;
	}
}