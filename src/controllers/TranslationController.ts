import { Express } from 'express';
import { HttpResponse, generatedSuccesResult } from '../models/HttpResponse';
import { TranslationResult } from '../models/translation/TranslationResult';
import { getTranslations } from '../service/TranslationService';
import ControllerInterface from "./ControllerInterface";

export class TranslationController extends ControllerInterface {
    constructor(app: Express, route: string) {
        super(app, route)

        app.get<string, { repositoryName: string, crowdinProjectId: string }, HttpResponse<TranslationResult>>(route + "/gettranslations", (req, res) => {
            console.info("Start Translation GetTranslations")
            try {
                getTranslations(req.params.repositoryName, req.params.crowdinProjectId).then((value) => {
                    res.send(generatedSuccesResult<TranslationResult>(value))
                })
            } catch (e) {
                this.sendError(res, e)
            }
        })
    }
}