import { playerDamageAnimation } from "../animations/animation.js";

export function PlayerOnAdd(player, id) {
  this.events.emit('newPlayer', id)
  let playersSize = Object.keys(this.playerEntities).length
  
  this.playerEntities[id] = this.physics.add.sprite(
    player.x + playersSize * 100,
    player.y + playersSize * 100,
    `ship_${playersSize + 1}_animado`
    )
    this.playerEntities[id].health = player.health;
    this.playerEntities[id].playerSize = playersSize + 1
  
  player.onChange(() => {
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

  if (entity) {
    console.log(`Jogador ${id} desconectado!`)

    delete this.playerEntities[id]

    document.getElementById(`player-${id}`).remove()

    entity.destroy()
  }
}
