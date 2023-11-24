export function PlayerOnAdd(player, id) {
  let playersSize = Object.keys(this.playerEntities).length
  let danoP = player.dano;
  
  this.playerEntities[id] = this.physics.add.sprite(
    player.x + playersSize * 100,
    player.y + playersSize * 100,
    `ship_${playersSize + 1}_animado`
    )
  //this.playerEntities[id].setTint(0xff00ff, 0xff0000, 0x00ff00, 0x0000ff);;

  this.playerEntities[id].anims.create({
    key: "ship_frente_d0",
    frames: [{ key: `ship_${playersSize + 1}_animado`, frame: 0 }],
    frameRate: 1,
  });

  this.playerEntities[id].anims.create({
    key: "ship_frente_d1",
    frames: [{ key: `ship_${playersSize + 1}_animado`, frame: 8 }],
    frameRate: 1,
  });

  this.playerEntities[id].anims.create({
    key: "ship_frente_d2",
    frames: [{ key: `ship_${playersSize + 1}_animado`, frame: 16 }],
    frameRate: 1,
  });

  this.playerEntities[id].anims.create({
    key: "ship_direita",
    frames: this.anims.generateFrameNumbers(`ship_${playersSize + 1}_animado`, { start: 1, end: 3 }),
    frameRate: 10,
    repeat: 0, // Não se repete, reproduz uma vez
  });
  
  this.playerEntities[id].anims.create({
    key: "ship_esquerda",
    frames: this.anims.generateFrameNumbers(`ship_${playersSize + 1}_animado`, { start: 5, end: 7 }),
    frameRate: 10,
    repeat: 0, // Não se repete, reproduz uma vez
  });
  
  this.playerEntities[id].anims.create({
    key: "ship_direita_reverse",
    frames: this.anims.generateFrameNumbers(`ship_${playersSize + 1}_animado`, { start: 3, end: 0 }),
    frameRate: 10,
    repeat: 0, // Não se repete, reproduz uma vez
  });
  
  this.playerEntities[id].anims.create({
    key: "ship_esquerda_reverse",
    frames: this.anims.generateFrameNumbers(`ship_${playersSize + 1}_animado`, { start: 7, end: 4 }),
    frameRate: 10,
    repeat: 0, // Não se repete, reproduz uma vez
  });
  
  player.onChange(() => {
    this.playerEntities[id].setData('serverX', player.x);
		this.playerEntities[id].setData('serverY', player.y);
    var animation = player.currentAnimation;
    if(player.dano > danoP) {
      this.somDano.play(); 
      danoP = player.dano;
      this.tweens.add({
        targets: this.playerEntities[id],
        alpha: 0,
        ease: 'Cubic.easeOut',  
        duration: 500,
        repeat: 0,
        yoyo: true,
        onStart: function () { this.targets[0].setTint(0xff0000); },
        onComplete: function () { this.targets[0].clearTint(); this.targets[0].anims.play(animation);}
      })
    } else {
      this.playerEntities[id].anims.play(animation);
    }
  })
}


export function PlayerOnRemove(player, id) {
  const entity = this.playerEntities[id]

  if (entity) {
    console.log(`Jogador ${id} desconectado!`)

    delete this.playerEntities[id]

    entity.destroy()
  }
}
