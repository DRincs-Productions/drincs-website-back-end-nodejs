import { Express } from 'express';
import { getFirebaseAuth, initializeFirebaseAdiminApp, initializeFirebaseApp } from '../utility/Firebase';
import { logTest } from '../utility/Logger';
import ControllerInterface from "./ControllerInterface";

export class TesterController extends ControllerInterface {
    constructor(app: Express, route: string) {
        super(app, route)

        app.get(route + "/logger", (req, res) => {
            res.send(logTest())
        })

        app.get(route + "/firebaseapp", (req, res) => {
            try {
                initializeFirebaseApp()
                res.send(true)
            }
            catch (ex) {
                res.send(false)
            }
        })

        app.get(route + "/firebaseadminapp", (req, res) => {
            try {
                initializeFirebaseAdiminApp()
                getFirebaseAuth()
                res.send(true)
            }
            catch (ex) {
                res.send(false)
            }
        })
    }
}