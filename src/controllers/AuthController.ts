import { Express } from 'express';
import { HttpResponse, generatedSuccesResult } from '../models/HttpResponse';
import { AuthData } from '../models/auth/AuthData';
import { NewAccountRecord } from '../models/auth/NewAccountRecord';
import { createAccountNewAccountRecord } from '../service/FirebaseAuthService';
import { logInfo } from '../utility/Logger';
import ControllerInterface from "./ControllerInterface";

export class AuthController extends ControllerInterface {
    constructor(app: Express, route: string) {
        super(app, route)

        app.post<string, any, HttpResponse<AuthData>, NewAccountRecord, { repositoryName: string }>(route + "/CreateAccount", (req, res) => {
            logInfo("Start Auth CreateAccount")
            try {
                createAccountNewAccountRecord(req.body).then((value) => {
                    res.send(generatedSuccesResult<AuthData>(value))
                }).catch((e) => {
                    this.sendError(res, e)
                })
            } catch (e) {
                this.sendError(res, e)
            }
        })
    }
}