import { playerDamageAnimation } from "../animations/animation.js";

export function PlayerOnAdd(player, id) {
  var number = 0;
  for(var x = 1; x <= 4; x++) {
    if(this.playersRoom[x] == null) {
      number = x;
      this.playersRoom[x]=id;
      break;
    }
  }
  this.playerEntities[id] = this.physics.add.sprite(
    player.x + number-1 * 100,
    player.y + number-1 * 100,
    `ship_${number}_animado`
  )
  this.playerEntities[id].number = x;
  this.events.emit('newPlayer', id, number)
  this.playerEntities[id].health = player.health;
  

  player.onChange(() => {
    this.playerEntities[id].setData('serverX', player.x);
		this.playerEntities[id].setData('serverY', player.y);
    this.playerEntities[id].setData('immortal', player.immortal);
    this.playerEntities[id].setData('health', player.health);
    
    if(this.playerEntities[id].health !== this.playerEntities[id].data.values.health) {
      playerDamageAnimation.bind(this)(player, id);

      this.playerEntities[id].health = this.playerEntities[id].data.values.health;

      if (this.playerEntities[id].health === 0) {
        this.events.emit('current-player-died', id)
      }

      if (this.isGameover()) {
        this.events.emit('gameover', this.generateGameoverInfo())
      }

      if (id === this.room.sessionId) {
        this.events.emit('healthChange', -1);
      }
    }

    this.playerEntities[id].score = player.score
    if (this.playerEntities[id]) {
      this.playerEntities[id].setData('serverX', player.x);
      this.playerEntities[id].setData('serverY', player.y);
      this.playerEntities[id].setData('immortal', player.immortal);
      this.playerEntities[id].setData('health', player.health);
      
      if((this.playerEntities[id].health !== this.playerEntities[id].data.values.health) && this.playerEntities[id].data.values.health > 0) {
        playerDamageAnimation.bind(this)(player, id);
      }
    }

    this.events.emit('playerScoreChange', id, player.score)
  })
}


export function PlayerOnRemove(player, id) {
  const entity = this.playerEntities[id]
  const number = this.playerEntities[id].number
  this.events.emit('playerRemoved', id, number);
  this.playersRoom[number] = null;
  
  entity.destroy();
  if (entity) {
    console.log(`Jogador ${id} desconectado!`)
    
    delete this.playerEntities[id]
  
    document.getElementById(`player-${id}`).remove()

    entity.destroy()
  }
}
