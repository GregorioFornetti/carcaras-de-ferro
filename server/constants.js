/* IMPORTANTE: SEMPRE QUE ATUALIZAR ALGO AQUI, TAMBÉM ATUALIZE O MESMO NO CLIENT
   O arquivo de constantes do servidor está disponível em: client/constants.js

   Aqui ficam as definições específicas dos objetos do jogo, que impactam na jogabilidade
   e dificuldade geral. Modique aqui se quiser mudar o comportamento geral de um inimigo
*/

export const MAX_SERVER_ROOMS = 25; // quantidade máxima de salas criadas

export const GAME_WIDTH = 448
export const GAME_HEIGHT = 512

// Player
export const NUM_BOMBS = 2
export const PLAYER_IMMORTAL_TIMER = 4
export const HEALTH = 3
export const PLAYER_SPEED = 4
export const PLAYER_WIDTH = 28
export const PLAYER_HEIGHT = 28

// Bomba
export const BOMB_SPEED_Y = 1
export const BOMB_SHRINK_SPEED = 20  
export const BOMB_INIT_SIZE = 2
export const BOMB_DETONATE_TIMER = 0.5 // Em segundos

//Spawner
export const SPAWNER_INIT_TIMER = 2
export const SPAWN_WEIGHT_SOLITARIO = 100
export const SPAWN_WEIGHT_PATRULHEIROS = 90
export const SPAWN_WEIGHT_DESAVISADOS = 65
export const SPAWN_WEIGHT_COMBATENTE = 45
export const SPAWN_WEIGHT_FORTALEZA = 15
export const SPAWN_WEIGHT_CACADOR = 30
export const SPAWN_WEIGHT_CRUZADOR = 35
export const SPAWN_WEIGHT_TANQUE = 30
export const SPAWN_WEIGHT_SUPER_TANQUE = 5
// vetor, cada posição i indica o peso de spawnar exatamente i inimigos na rodada
export const SPAWN_NUMBER_WEIGHTS = [20, 15, 10, 5, 3, 2, 1]; 


// Combatente
export const COMBATENTE_HEALTH = 4
export const COMBATENTE_HEIGHT = 32
export const COMBATENTE_WIDTH = 32
export const COMBATENTE_SCORE = 650
export const COMBATENTE_VERTICAL_SPEED = 75
export const COMBATENTE_MIN_VERTICAL_POS = 0.1
export const COMBATENTE_INTERMEDIARY1_VERTICAL_POS = 0.3
export const COMBATENTE_INTERMEDIARY2_VERTICAL_POS = 0.5
export const COMBATENTE_MAX_VERTICAL_POS = 0.7
export const COMBATENTE_MIN_HORIZONTAL_SPEED = 15
export const COMBATENTE_MAX_HORIZONTAL_SPEED = 150
export const COMBATENTE_HORIZONTAL_MOVEMENT_SIZE = 128


// Fortaleza
export const FORTALEZA_HEALTH = 12
export const FORTALEZA_HEIGHT = 84
export const FORTALEZA_WIDTH = 130
export const FORTALEZA_SCORE = 1000
export const FORTALEZA_SPEED = 50

// Desavisados
export const DESAVISADOS_HEALTH = 1
export const DESAVISADOS_HEIGHT = 32
export const DESAVISADOS_WIDTH = 32
export const DESAVISADOS_SCORE = 100
export const DESAVISADOS_SPEED = 150

// Solitario
export const SOLITARIO_HEALTH = 1
export const SOLITARIO_HEIGHT = 32
export const SOLITARIO_WIDTH = 32
export const SOLITARIO_SCORE = 50
export const SOLITARIO_SPEED = 50

// Patrulheiro
export const PATRULHEIRO_HEALTH = 1
export const PATRULHEIRO_HEIGHT = 32
export const PATRULHEIRO_WIDTH = 32
export const PATRULHEIRO_SCORE = 75
export const PATRULHEIRO_SPEED = 75

//Caçador
export const CACADOR_HEALTH = 2
export const CACADOR_HEIGHT = 32
export const CACADOR_WIDTH = 32
export const CACADOR_SCORE = 500
export const CACADOR_SPEED = 350
export const CACADOR_LIM_PERSUIT = 80

//Cruzador
export const CRUZADOR_HEALTH = 2
export const CRUZADOR_WIDTH = 32
export const CRUZADOR_HEIGHT = 32
export const CRUZADOR_SCORE = 350
export const CRUZADOR_SPEED = 220
export const CRUZADOR_FIRERATE = 2

//constantes auxiliares de Debug
export const DEBUG_IMMORTAL = false