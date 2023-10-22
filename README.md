## Carcaras de Ferro

Estão tentando dominar Fernando de Noronha! Uma poderosa gangue armada conseguiu muito dinheiro no jogo do bixo e está aumentando seu controle por todos os cantos do país. A ABIN detectou um iminente ataque a Fernando de Noronha: os criminosos querem tomar a ilha e montar sua base de operações! Você faz parte do esquadrão de Elite da FAB chamado “Carcarás de Ferro”, a tropa aérea treinada para deter os bixeiros. O dia da invasão chegou, e você deverá lutar contra hordas ininterruptas de aeronaves inimigas.
 
O game é do gênero Shoot ‘em Up, em que o jogador controla uma aeronave e deve enfrentar diversas naves e tanques inimigos. O jogo, ainda, é do tipo “endless”, que só acaba quando o jogador morrer, ficando progressivamente mais difícil conforme o tempo passa. O objetivo é simplesmente alcançar o maior placar, como nos clássicos arcades. É um game feito para navegador web que pode ser jogado em modo multiplayer com outros jogadores. Feito para navegador com Phaser.Js e Multiplayer suportado pelo Colyseus.

Duas partes compõem esse projeto
* cliente: responsável pela renderização do jogo no navegador do jogador
* servidor: sincroniza o estado entre os múltiplos clientes, além de servir a página ao cliente

Uma descrição geral do diretório do servidor está abaixo

├── ecosystem.config.cjs     
├── package.json     
├── package-lock.json    
└── src     
    ├── **app.config.js**    
    ├── index.js    
    └── rooms    
        ├── **MyRoom.js**     
        └── schema     
            └── **MyRoomState.js**      

**app.config.js**: Configuração geral das salas e lógica do servidor Express.
**MyRoom.js**: Definição da sala e lógica do multiplayer.
**MyRoomState.js**: Definição das variáveis que compõem o estado do jogo multiplayer.

## Execução

### Backend

Recomenda-se instalar o nodemon, para recarga automatica do código servidor após uma mudança no arquivo fonte:

```bash
npm install -g nodemon
```

Para executar o programa para desenvolvimento, após install o nodemon, execute:

```bash
npm test
```

Para executar o programa diretamente:

```bash
npm start
```

### Frontend

Coloque no ar o arquivo `client/index.html`. Isso pode ser feito usando extensões do próprio VSCode, como a [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)