import { Express } from 'express';
import { ProjectsEnum, getTranslationValuesByEnum } from '../enum/ProjectsEnum';
import { HttpResponse, generatedSuccesResult } from '../models/HttpResponse';
import { TranslationResult } from '../models/translation/TranslationResult';
import { getTranslations } from '../service/TranslationService';
import { logInfo } from '../utility/Logger';
import ControllerInterface from "./ControllerInterface";

export class TranslationController extends ControllerInterface {
    constructor(app: Express, route: string) {
        super(app, route)

        app.get<string, any, HttpResponse<TranslationResult>, any, { projectId: ProjectsEnum }>(route + "/GetTranslations", (req, res) => {
            logInfo("Start Translation GetTranslations")
            try {
                let data = getTranslationValuesByEnum(req.query.projectId)
                let repositoryName = data.github
                let crowdinProjectId = data.crowdin
                let crowdinLink = data.crowdinLink
                getTranslations(repositoryName, crowdinProjectId).then((value) => {
                    value.crowdinLink = crowdinLink
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