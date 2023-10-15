/*
    Classe base para todos os inimigos do jogo.
    Define uma inicialização, que cria um "Schema" de inimigo e o coloca na coleção de inimigos da sala
    Um Schema é um estado sincronizado entre o servidor e os clientes.
    Define também um update, que define o comportamento do inimigo. 
    O update é particular de cada inimigo
    Essa classe base em sí não tem Schema, apenas suas subclasses
*/

let enemyId = 0;  // Provavelmente vai precisar mudar isso no futuro... Pode ser gerado por room ?

export class Enemy {

    init(enemiesState, EnemySchema) {
        this.enemyAttributes = new EnemySchema();
        this.enemiesState = enemiesState;
        this.id = enemyId++;
        this.enemiesState.set(this.id, this.enemyAttributes);
        this.dead = false;
    }

    update(deltaTime) {
        throw new Error('You have to implement the method update!');
    }

    destroy() {
        if (this.dead) {
            return
        }
        
        this.enemiesState.delete(this.id.toString());
        this.dead = true
    }
}