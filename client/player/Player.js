export function PlayerOnAdd(player, id) {
  this.events.emit('newPlayer', id)
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
    
  /** Animações da movimentação Player */
  // d0 = sem dano
  // d1 = tomou 1° dano
  // d2 = tomou 2° dano
  this.playerEntities[id].anims.create({
    key: "ship_frente_d0",
    frames: [{ key: `ship_${playersSize + 1}_animado`, frame: 0 }],
    frameRate: 10,
  });
  this.playerEntities[id].anims.create({
    key: "ship_frente_d1",
    frames: [{ key: `ship_${playersSize + 1}_animado`, frame: 8 }],
    frameRate: 10,
  });
  this.playerEntities[id].anims.create({
    key: "ship_frente_d2",
    frames: [{ key: `ship_${playersSize + 1}_animado`, frame: 16 }],
    frameRate: 10,
  });
  this.playerEntities[id].anims.create({
    key: "ship_direita_d0",
    frames: this.anims.generateFrameNumbers(`ship_${playersSize + 1}_animado`, { start: 0, end: 3 }),
    frameRate: 10,
    repeat: 0, 
  });
  this.playerEntities[id].anims.create({
    key: "ship_direita_d1",
    frames: this.anims.generateFrameNumbers(`ship_${playersSize + 1}_animado`, { start: 8, end: 11 }),
    frameRate: 10,
    repeat: 0, 
  });
  this.playerEntities[id].anims.create({
    key: "ship_direita_d2",
    frames: this.anims.generateFrameNumbers(`ship_${playersSize + 1}_animado`, { start: 16, end: 19 }),
    frameRate: 10,
    repeat: 0, 
  });
  this.playerEntities[id].anims.create({
    key: "ship_esquerda_d0",
    frames: this.anims.generateFrameNumbers(`ship_${playersSize + 1}_animado`, { start: 4, end: 7 }),
    frameRate: 10,
    repeat: 0, 
  });
  this.playerEntities[id].anims.create({
    key: "ship_esquerda_d1",
    frames: this.anims.generateFrameNumbers(`ship_${playersSize + 1}_animado`, { start: 12, end: 15 }),
    frameRate: 10,
    repeat: 0, 
  });
  this.playerEntities[id].anims.create({
    key: "ship_esquerda_d2",
    frames: this.anims.generateFrameNumbers(`ship_${playersSize + 1}_animado`, { start: 20, end: 23 }),
    frameRate: 10,
    repeat: 0, 
  });
  this.playerEntities[id].anims.create({
    key: "explosao",
    frames: this.anims.generateFrameNumbers("explosao", { start: 0, end: 7 }),
    frameRate: 10,
    repeat: 0, 
  });
  
  player.onChange(() => {
    this.playerEntities[id].setData('serverX', player.x);
		this.playerEntities[id].setData('serverY', player.y);
    var animation = player.currentAnimation;
    
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
        onComplete: function () { this.targets[0].clearTint(); }
      });    
    }
    playerHtml.innerHTML = `Jogador ${playersSize+1}: ${player.score}`
    this.events.emit('playerScoreChange', id, player.score)
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
