

let enemyId = 0;  // Provavelmente vai precisar mudar isso no futuro... Pode ser gerado por room ?

export class Enemy {

    constructor(roomState) {
        throw new Error('You have to implement the method constructor!');
    }

    init(enemies, EnemySchema) {
        this.enemyAttributes = new EnemySchema();
        this.enemies = enemies;
        this.id = enemyId++;
        this.enemies.set(this.id, this.enemyAttributes);
        this.dead = false
    }

    update(deltaTime) {
        throw new Error('You have to implement the method update!');
    }

    destroy() {
        if (this.dead) {
            return
        }
        
        this.enemies.delete(this.id);
        this.dead = true
    }
}