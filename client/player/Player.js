export function PlayerOnAdd(player, id) {
  let playersSize = Object.keys(this.playerEntities).length

  this.playerEntities[id] = this.physics.add.sprite(
    player.x + playersSize * 100,
    player.y + playersSize * 100,
    `ship_${playersSize + 1}_animado`
  )

  this.playerEntities[id].anims.create({
    key: "ship_frente",
    frames: [{ key: `ship_${playersSize + 1}_animado`, frame: 0 }],
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

  this.anims.create({
    key: "ship_direita_reverse",
    frames: this.anims.generateFrameNumbers(`ship_${playersSize + 1}_animado`, { start: 3, end: 0 }),
    frameRate: 10,
    repeat: 0, // Não se repete, reproduz uma vez
  });

  this.anims.create({
    key: "ship_esquerda_reverse",
    frames: this.anims.generateFrameNumbers(`ship_${playersSize + 1}_animado`, { start: 7, end: 4 }),
    frameRate: 10,
    repeat: 0, // Não se repete, reproduz uma vez
  });

  player.onChange(() => {
    this.playerEntities[id].setData('serverX', player.x);
		this.playerEntities[id].setData('serverY', player.y);
    var animation = player.currentAnimation;
    console.log(animation);
    this.playerEntities[id].anims.play(animation);
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
