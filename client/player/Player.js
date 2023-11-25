export function PlayerOnAdd(player, id) {
  let playersSize = Object.keys(this.playerEntities).length

  const playersHtmlContainer = document.getElementById('players')
  const playerHtml = document.createElement('div')
  playerHtml.id = `player-${id}`

  playersHtmlContainer.appendChild(playerHtml)

  this.playerEntities[id] = this.physics.add.sprite(
    player.x + playersSize * 100,
    player.y + playersSize * 100,
    `ship_${playersSize + 1}`
  )

  player.onChange(() => {
    this.playerEntities[id].setData('serverX', player.x);
		this.playerEntities[id].setData('serverY', player.y);

    playerHtml.innerHTML = `Jogador ${playersSize+1}: ${player.score}`
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
