import { Express } from 'express';
import { HttpResponse, generatedSuccesResult } from '../models/HttpResponse';
import { AuthData } from '../models/auth/AuthData';
import { LoginAccount } from '../models/auth/LoginAccount';
import { NewAccountRecord } from '../models/auth/NewAccountRecord';
import { createAccountNewAccountRecord, oAuthDiscordCallback, resetPassword, signInWithEmailPassword } from '../service/FirebaseAuthService';
import { logError, logInfo } from '../utility/Logger';
import { getClientUrl, getOAuthDiscordCallback } from '../utility/UtilityFunctionts';
import ControllerInterface from "./ControllerInterface";

export class AuthController extends ControllerInterface {
    constructor(app: Express, route: string) {
        super(app, route)

        app.post<string, any, HttpResponse<AuthData>, NewAccountRecord>(route + "/CreateAccount", (req, res) => {
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

        app.post<string, any, HttpResponse<AuthData>, LoginAccount>(route + "/SignInWithEmailAndPassword", (req, res) => {
            logInfo("Start Auth SignInWithEmailAndPasswordAsync")
            try {
                signInWithEmailPassword(req.body, req.headers.host).then((value) => {
                    res.send(generatedSuccesResult<AuthData>(value))
                }).catch((e) => {
                    this.sendError(res, e)
                })
            } catch (e) {
                this.sendError(res, e)
            }
        })

        app.post<string, any, HttpResponse<boolean>, any, { email: string }>(route + "/ResetPassword", (req, res) => {
            logInfo("Start Auth ResetPassword")
            try {
                resetPassword(req.query.email).then((value) => {
                    res.send(generatedSuccesResult<boolean>(value))
                }).catch((e) => {
                    this.sendError(res, e)
                })
            } catch (e) {
                this.sendError(res, e)
            }
        })

        app.get<string, any, HttpResponse<string>>(route + "/GetOAuthDiscordLink", (req, res) => {
            logInfo("Start Auth GetOAuthDiscordLink")
            res.send(generatedSuccesResult<string>(getOAuthDiscordCallback()))
        })

        app.get<string, any, HttpResponse<string>, any, { code: string }>(route + "/OAuthDiscordCallback", async (req, res) => {
            logInfo("Start Auth OAuthDiscordCallback");
            try {
                let data = await oAuthDiscordCallback(req.query.code, req.headers.host);
                let clienturl: string = getClientUrl()

                if (!data) {
                    logError("AuthController OAuthDiscordCallback Content is null Error");
                    res.redirect(clienturl)
                }

                res.redirect(data)
            } catch (e) {
                this.sendError(res, e)
            }
        })
    }
}