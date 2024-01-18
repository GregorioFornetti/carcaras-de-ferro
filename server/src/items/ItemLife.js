import * as schema from "@colyseus/schema";
import { Item } from "./Item.js";

export class ItemLifeSchema extends schema.Schema {}

schema.defineTypes(ItemLifeSchema, {
  x: "number",
  y: "number"
});

export class ItemLife extends Item {
  constructor(roomState, x, y) {
    super();
    this.init(roomState.itemLifeSchema, ItemLifeSchema, x, y);
    this.speed = 100;
  }

  static spawn(roomState, x, y) {	
		const itemLife = new ItemLife(roomState, x, y);
		itemLife.itemAttributes.x = x;
		itemLife.itemAttributes.y = y;
		
		return itemLife;
	}
}