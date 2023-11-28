export function BackgroundOnAdd(background, id) {
  this.bg = this.add.tileSprite(width/2, height/2, width, height, 'myMap'); //tileSprite para movimentacao

	background.onChange(() => {
		this.bg.setData('serverY', background.y);
		})
	}

export function BackgroundOnRemove(background, id) {
  //const entity = this.playerEntities[id]
	
	/*
  if (entity) {
    console.log(`Jogador ${id} desconectado!`)

    delete this.playerEntities[id]

    entity.destroy()
  }
  */
}
