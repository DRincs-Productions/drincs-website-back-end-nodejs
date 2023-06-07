import { Express } from 'express';
import { HttpResponse, generatedSuccesResult } from '../models/HttpResponse';
import { TranslationResult } from '../models/translation/TranslationResult';
import { getTranslations } from '../service/TranslationService';
import { logInfo } from '../utility/Logger';
import ControllerInterface from "./ControllerInterface";

export class TranslationController extends ControllerInterface {
    constructor(app: Express, route: string) {
        super(app, route)

        app.get<string, any, HttpResponse<TranslationResult>, any, { repositoryName: string, crowdinProjectId: string }>(route + "/gettranslations", (req, res) => {
            logInfo("Start Translation GetTranslations")
            try {
                getTranslations(req.query.repositoryName, req.query.crowdinProjectId).then((value) => {
                    res.send(generatedSuccesResult<TranslationResult>(value))
                }).catch((e) => {
                    this.sendError(res, e)
                })
            } catch (e) {
                this.sendError(res, e)
            }
        })
    }
}