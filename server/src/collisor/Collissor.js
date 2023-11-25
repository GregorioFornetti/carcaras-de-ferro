import * as detectCollission from 'detect-collisions'
import { response } from 'express'
/*
    A classe Collisor é responsável por detectar colisões entre objetos do jogo.
    Os objetos a coliderem devem ter pelo menos x e y no schema, width, height e id no gameObj
    O id é combinado com o objtype para formar uma chave única para o objeto do jogo
    O objtype é utilizado para aplicar funções específicas para cada tipo de colisão do jogo
*/
export class Collisor {
    constructor() {
        this.collisionObjs = {}
        this.callbacks = {}
        this.system = new detectCollission.System()
    }

    registerForCollission(gameObj, schema, objtype = "") {
        if (!schema.x || !schema.y) {
            return
        }
        else if(!gameObj.width || !gameObj.height) {
            return
        }
        // A posição pode estar um pouco errada
        const collisionObj = new detectCollission.Box(
            {
                x:schema.x - (gameObj.width/2),
                y:schema.y - (gameObj.height/2)
            }, 
            gameObj.width, 
            gameObj.height)
        collisionObj.gameObj = gameObj
        collisionObj.schema = schema
        collisionObj.objtype = objtype
        this.system.insert(collisionObj) 
        this.collisionObjs[objtype + String(gameObj.id)] = collisionObj
    }

    multipleRegisterForCollission(gameObjs, schemas,type = "") {
        if (gameObjs.length != schemas.length) {
            throw new Error("gameObjs and schemas must have the same length")
        }
        for (let i = 0; i < gameObjs.length; i++) {
            this.registerForCollission(gameObjs[i], schemas[i])
        }
    }

    removeForCollission(gameObj,objtype = "") {
        if (!this.collisionObjs[objtype + String(gameObj.id)]) {
            return
        }
        this.system.remove(this.collisionObjs[objtype + String(gameObj.id)])
        delete this.collisionObjs[objtype + String(gameObj.id)]
    }

    multipleRemoveForCollission(gameObjs, objtype = "") {
        for (let gameObj of gameObjs) {
            this.removeForCollission(gameObj,objtype)
        }
    }

    registerActionForCollission(objtype1, objtype2, callback) {
        this.callbacks[objtype1 + objtype2] = callback
    }

    update() {
        for (let cobj in this.collisionObjs) {
            this.collisionObjs[cobj].setPosition(this.collisionObjs[cobj].schema.x, this.collisionObjs[cobj].schema.y)
        }

        this.system.checkAll((response) => {
            const callback = this.callbacks[response.a.objtype + response.b.objtype]
            if (callback) {
                callback(response.a.gameObj, response.b.gameObj, this.collisionObjs.length)
            }
        })
    }
}