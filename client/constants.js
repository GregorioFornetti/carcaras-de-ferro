// IMPORTANTE: SEMPRE QUE ATUALIZAR ALGO AQUI, TAMBÉM ATUALIZE O MESMO NO SERVER
// o arquivo de constantes do servidor está disponível em: server/constants.js

export const GAME_WIDTH = 448
export const GAME_HEIGHT = 512
export const NUM_BOMBAS = 2
export const SCALE_HEART = 0.77  
export const BOMB_INIT_SIZE = 3
export const BOMB_SHRINK_SPEED = 0.2
// O domínio para conexão do WebSocket é obtido automaticamente da URL em que o usuário se conectou no webserver
export const DOMAIN = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`; 
