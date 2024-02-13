import config from "@colyseus/tools"
import { monitor } from "@colyseus/monitor"
import { playground } from "@colyseus/playground"
import express from "express"

/**
 * Importe suas salas aqui
 */
import { MyRoom } from "./rooms/MyRoom.js"

export default config.default({
  initializeGameServer: (gameServer) => {
    /**
     * Registre suas salas aqui
     */
    gameServer.define("my_room", MyRoom)
  },

  initializeExpress: (app) => {
    app.use("/Artes", express.static("./../Artes"))
    app.use("/Efeitos", express.static("./../Efeitos"))
    app.use("/", express.static("./../client"))
  },
})
