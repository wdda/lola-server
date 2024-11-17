import config from "@colyseus/tools"
import { monitor } from "@colyseus/monitor"
import basicAuth from "express-basic-auth"

import { MainRoom } from "./rooms/MainRoom"

export default config({
    getId: () => "game",

    initializeGameServer: (gameServer) => {
        gameServer.define('main_room', MainRoom)
          .filterBy(['levelId', 'password'])
    },

    initializeExpress: (app) => {
        app.get("/", (req, res) => {
            res.send(':)')
        })

        const basicAuthMiddleware = basicAuth({
            // list of users and passwords
            users: {
                "admin": "secretHuyIGovno43242",
            },
            // sends WWW-Authenticate header, which will prompt the user to fill
            // credentials in
            challenge: true
        });

        app.use("/colyseus", basicAuthMiddleware, monitor());
    },


    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});