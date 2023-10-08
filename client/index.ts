import { Client, Room } from "colyseus.js";
import Phaser from "phaser";
import EnemyShip from "./assets/ship_0001.png"
import PlayerShip from "./assets/ship_0000.png"

// custom scene class
export class GameScene extends Phaser.Scene {
    client = new Client("ws://localhost:2567");
    room: Room;
    playerEntities: {[sessionId: string]: any} = {};
    inputPayload = {
        left: false,
        right: false,
        up: false,
        down: false,
    };

    cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

    preload() {
        this.load.image('player_ship', PlayerShip);
        this.load.image('enemy_ship', EnemyShip);
        this.cursorKeys = this.input.keyboard.createCursorKeys();
    }

    async create() {
        console.log("Joining room...");

        try {
            this.room = await this.client.joinOrCreate("my_room");
            console.log("Joined successfully!");
        } catch (e) {
            console.error(e);
        }

        this.room.state.players.onRemove((player, sessionId) => {
            const entity = this.playerEntities[sessionId];
            if (entity) {
                // destroy entity
                entity.destroy();
        
                // clear local reference
                delete this.playerEntities[sessionId];
            }
        });

        this.room.state.players.onAdd((player, sessionId) => {        
            // listening for server updates
            player.onChange(() => {
                // atualização recebida do servidor
                console.log(`Atualização recebida do player ${sessionId}: left: ${player.left}, right: ${player.right}, up: ${player.up}, down: ${player.down}`)
            });
        
            
        });
    }

    update(time: number, delta: number): void {
        // skip loop if not connected with room yet.
        if (!this.room) {
            return; 
        }
  
        // send input to the server
        this.inputPayload.left = this.cursorKeys.left.isDown;
        this.inputPayload.right = this.cursorKeys.right.isDown;
        this.inputPayload.up = this.cursorKeys.up.isDown;
        this.inputPayload.down = this.cursorKeys.down.isDown;
        if (this.inputPayload.left || this.inputPayload.right || this.inputPayload.up || this.inputPayload.down) {
            console.log(`Input enviado: left: ${this.inputPayload.left}, right: ${this.inputPayload.right}, up: ${this.inputPayload.up}, down: ${this.inputPayload.down}`)
            this.room.send(0, this.inputPayload);
        }
    }
}

// game config
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#b6d53c',
    parent: 'phaser-example',
    physics: { default: "arcade" },
    pixelArt: true,
    scene: [ GameScene ],
};

// instantiate the game
const game = new Phaser.Game(config);