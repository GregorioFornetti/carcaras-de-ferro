import * as schema from "@colyseus/schema";

export class Player extends schema.Schema {

}

schema.defineTypes(Player, {
    x: "number",
    y: "number",
});


export class MyRoomState extends schema.Schema {
  constructor() {
    super();
    this.players = new schema.MapSchema();
  }
}

schema.defineTypes(MyRoomState, {
    players: { map: Player },
})
