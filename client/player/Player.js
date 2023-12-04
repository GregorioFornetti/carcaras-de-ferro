export function PlayerOnAdd(player, id) {
  let playersSize = Object.keys(this.playerEntities).length
  let danoP = player.dano;
  
  const playersHtmlContainer = document.getElementById('players')
  const playerHtml = document.createElement('div')
  playerHtml.id = `player-${id}`

  playersHtmlContainer.appendChild(playerHtml)

  this.playerEntities[id] = this.physics.add.sprite(
    player.x + playersSize * 100,
    player.y + playersSize * 100,
    `ship_${playersSize + 1}_animado`
  )
  
  player.onChange(() => {
    this.playerEntities[id].setData('serverX', player.x);
		this.playerEntities[id].setData('serverY', player.y);
    
    /** simulação de dano utilizando keyboard (R) e atributo "dano" do player */
    if(player.dano > danoP) { // danoP = variavel auxiliar para verificar se o dano foi alterado
      if(player.dano == 3) this.somExplosao.play();
      else this.somDano.play(); 
      danoP = player.dano; 
      this.tweens.add({
        targets: this.playerEntities[id],
        alpha: 0,
        duration: 300,
        repeat: 4,
        yoyo: true,
        onStart: function () { this.targets[0].setTint(0xff0000); this.targets[0].anims.play(animation); },
        onComplete: function () { this.targets[0].clearTint();  }
      });    
    }
    playerHtml.innerHTML = `Jogador ${playersSize+1}: ${player.score}`
  })
}


export function PlayerOnRemove(player, id) {
  const entity = this.playerEntities[id]

  if (entity) {
    //animacao sprites e som
    entity.somExplosao.play();
    entity.anims.play("explosao"); 

    console.log(`Jogador ${id} desconectado!`)

    delete this.playerEntities[id]

    document.getElementById(`player-${id}`).remove()

    entity.destroy()
  }
}
