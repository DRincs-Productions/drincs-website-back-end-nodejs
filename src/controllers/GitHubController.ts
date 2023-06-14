import { Express } from 'express';
import { ProjectsEnum, getTranslationValuesByEnum } from '../enum/ProjectsEnum';
import { HttpResponse, generatedSuccesResult } from '../models/HttpResponse';
import { GitHubCreateIssueBody } from '../models/git/GitHubCreateIssueBody';
import { GitHubTranslationRelease } from '../models/git/GitHubTranslationRelease';
import { GitRelease } from '../models/git/GitRelease';
import { createIssue, getReleases, getTranslationRelease } from '../service/GitHubService';
import { logInfo } from '../utility/Logger';
import ControllerInterface from "./ControllerInterface";

export class GitHubController extends ControllerInterface {
    constructor(app: Express, route: string) {
        super(app, route)

        app.get<string, any, HttpResponse<GitRelease[]>, any, { projectId: ProjectsEnum }>(route + "/GetReleases", (req, res) => {
            logInfo("Start GitHub GetReleases")
            try {
                let repositoryName = getTranslationValuesByEnum(req.query.projectId).github
                getReleases(repositoryName).then((value) => {
                    res.send(generatedSuccesResult<GitRelease[]>(value))
                }).catch((e) => {
                    this.sendError(res, e)
                })
            } catch (e) {
                this.sendError(res, e)
            }
        })

        app.get<string, any, HttpResponse<GitHubTranslationRelease[]>, any, { projectId: ProjectsEnum }>(route + "/GetTranslationRelease", (req, res) => {
            logInfo("Start GitHub GetTranslationRelease")
            try {
                let repositoryName = getTranslationValuesByEnum(req.query.projectId).github
                getTranslationRelease(repositoryName).then((value) => {
                    res.send(generatedSuccesResult<GitHubTranslationRelease[]>(value))
                }).catch((e) => {
                    this.sendError(res, e)
                })
            } catch (e) {
                this.sendError(res, e)
            }
        })

        app.get<string, any, HttpResponse<object>, GitHubCreateIssueBody, { projectId: ProjectsEnum }>(route + "/CreateIssue", (req, res) => {
            logInfo("Start GitHub CreateIssue")
            try {
                let repositoryName = getTranslationValuesByEnum(req.query.projectId).github
                createIssue(repositoryName, req.body).then((value) => {
                    res.send(generatedSuccesResult<object>(value))
                }).catch((e) => {
                    this.sendError(res, e)
                })
            } catch (e) {
                this.sendError(res, e)
            }
        })
    }
}