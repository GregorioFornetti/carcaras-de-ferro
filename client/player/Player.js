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
    this.playerEntities[id].setData('serverX', player.x);
		this.playerEntities[id].setData('serverY', player.y);
    this.playerEntities[id].setData('immortal', player.immortal);
    this.playerEntities[id].setData('health', player.health);
    
    if(this.playerEntities[id].health !== this.playerEntities[id].data.values.health) {
      let tweenAnimation = `ship_frente_d${3-this.playerEntities[id].data.values.health}_${playersSize+1}`;
      this.somExplosao.play()
      this.tweens.add({
        targets: this.playerEntities[id],
        alpha: 0,
        duration: 300,
        repeat: 4,
        yoyo: true,
        onStart: function() { this.targets[0].setTint(0xff0000); this.targets[0].anims.play(tweenAnimation); },
        onComplete: function() { this.targets[0].clearTint(); }
      });    
      this.events.emit('healthChange', -1);
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
