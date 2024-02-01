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
  this.playerEntities[id].number = playersSize + 1;

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
    frameRate: 20,
    repeat: 0,
  });

  // Client Predict
  // Se esse é o player do cliente
  if (id === this.room.sessionId) {
    this.currentPlayer = this.playerEntities[id]
  }

  player.onChange(() => {
    if (id === this.room.sessionId) {
      this.playerEntities[id].setData('serverX', player.x);
      this.playerEntities[id].setData('serverY', player.y);
      this.playerEntities[id].setData('immortal', player.immortal);
      this.playerEntities[id].setData('health', player.health);
    }
    if (this.playerEntities[id].health !== this.playerEntities[id].data.values.health) {
      let tweenAnimation = `ship_frente_d${3 - this.playerEntities[id].data.values.health}_${playersSize + 1}`;
      this.somExplosao.play()
      this.tweens.add({
        targets: this.playerEntities[id],
        alpha: 0,
        duration: 300,
        repeat: 4,
        yoyo: true,
        onStart: function () { this.targets[0].setTint(0xff0000); this.targets[0].anims.play(tweenAnimation); },
        onComplete: function () { this.targets[0].clearTint(); }
      });

      this.playerEntities[id].health = this.playerEntities[id].data.values.health;

      if (this.playerEntities[id].health === 0 && id === this.room.sessionId) {
        this.events.emit('current-player-died')
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
      if (id === this.room.sessionId) {
        this.playerEntities[id].setData('serverX', player.x);
        this.playerEntities[id].setData('serverY', player.y);
        this.playerEntities[id].setData('immortal', player.immortal);
        this.playerEntities[id].setData('health', player.health);
      }

      if ((this.playerEntities[id].health !== this.playerEntities[id].data.values.health) && this.playerEntities[id].data.values.health > 0) {
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

export function setMovement() {
  this.currentPlayer
}
