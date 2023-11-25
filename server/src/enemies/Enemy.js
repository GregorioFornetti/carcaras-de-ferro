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

    static spawn(enemiesState) {
        /*
            Deve ser chamada para criar um novo conjunto de inimigos na sala.
            Retorna um conjunto de inimigos (em um array), já devidamente inicializados.
        */
        throw new Error('You have to implement the method spawn!');
    }

    init(enemiesState, EnemySchema) {
        /*
            Função de inicialização do inimigo. Deve ser chamada no construtor da classe filha.
        */

        this.enemyAttributes = new EnemySchema();  // Atributos do inimigo atual
        this.enemiesState = enemiesState;  // Coleção de inimigos desse tipo na sala atualmente
        this.id = enemyId++;  // Id único do inimigo, pode ser útil no futuro em colisões
        this.enemiesState.set(this.id, this.enemyAttributes);
        this.dead = false;
        this.width = 32
        this.height = 32
    }

    update(deltaTime) {
        /*
            Função que será chamada no gameloop do servidor. Principal função para movimentação dos inimigos.
        */
        throw new Error('You have to implement the method update!');
    }

    destroy() {
        /*
            Função que remove o inimigo da coleção de inimigos da sala
        */
        if (this.dead) {
            return
        }
        
        this.enemiesState.delete(this.id.toString());
        this.dead = true
    }

    onNuke() {
        this.destroy()
    }
}