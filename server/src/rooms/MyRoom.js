import { Room } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState.js";
import { Player } from "./schema/MyRoomState.js";

export class MyRoom extends Room {
    maxClients = 4;

    onCreate (options) {
        this.setState(new MyRoomState());

        this.onMessage("type", (client, message) => {
            //
            // handle "type" message.
            //
        });

        // handle player input
        this.onMessage(0, (client, data) => {
            // get reference to the player who sent the message
            const player = this.state.players.get(client.sessionId);

            console.log(`Input recebido do player ${client.sessionId}: left: ${data.left}, right: ${data.right}, up: ${data.up}, down: ${data.down}`)

            player.left = data.left
            player.right = data.right
            player.up = data.up
            player.down = data.down
        });
    }

    onJoin (client, options) {
        console.log(client.sessionId, "joined!");

        // create Player instance
        const player = new Player();

        // place player in the map of players by its sessionId
        // (client.sessionId is unique per connection!)
        this.state.players.set(client.sessionId, player);
    }

    onLeave (client, consented) {
        console.log(client.sessionId, "left!");

        this.state.players.delete(client.sessionId);
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }

}
