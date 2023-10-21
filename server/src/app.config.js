import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import express from "express";

/**
 * Importe suas salas aqui
 */
import { MyRoom } from "./rooms/MyRoom.js";

export default config.default({

    initializeGameServer: (gameServer) => {
        /**
         * Registre suas salas aqui
         */
        gameServer.define('my_room', MyRoom);
    },

    initializeExpress: (app) => {
        /**
         * Playground. útil para debugar a sala. Basta acessar no navegador http://localhost:2567/playground
         */
        if (process.env.NODE_ENV !== "production") {
            app.use("/playground", playground);
        }

        /**
         * Monitor das salas do Colyseus. Basta acessar no navegador http://localhost:2567/colyseus
        */
        app.get("/colyseus", monitor());
        app.use('/', express.static("./../client"));

    },
});
