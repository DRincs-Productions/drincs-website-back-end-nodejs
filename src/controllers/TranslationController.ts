import { Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HttpResponse } from '../models/HttpResponse';
import { TranslationResult } from '../models/translation/TranslationResult';
import ControllerInterface from "./ControllerInterface";

export class TranslationController extends ControllerInterface {
    constructor(app: Express, route: string) {
        super(app, route)

        app.get<string, { repositoryName: string, crowdinProjectId: string }, HttpResponse<TranslationResult>>(route + "GetTranslations", (req, res) => {
            console.info("Start Translation GetTranslations")
            try {
                res.send(new HttpResponse<TranslationResult>(StatusCodes.OK))
            } catch (e) {
                //res.status(500).send(this.catch<TranslationResult>(e))
            }
        })
    }
}