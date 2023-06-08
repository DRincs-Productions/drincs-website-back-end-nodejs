import { Express } from 'express';
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

        app.get<string, any, HttpResponse<GitRelease[]>, any, { repositoryName: string }>(route + "/GetReleases", (req, res) => {
            logInfo("Start GitHub GetReleases")
            try {
                getReleases(req.query.repositoryName).then((value) => {
                    res.send(generatedSuccesResult<GitRelease[]>(value))
                }).catch((e) => {
                    this.sendError(res, e)
                })
            } catch (e) {
                this.sendError(res, e)
            }
        })

        app.get<string, any, HttpResponse<GitHubTranslationRelease[]>, any, { repositoryName: string }>(route + "/GetTranslationRelease", (req, res) => {
            logInfo("Start GitHub GetTranslationRelease")
            try {
                getTranslationRelease(req.query.repositoryName).then((value) => {
                    res.send(generatedSuccesResult<GitHubTranslationRelease[]>(value))
                }).catch((e) => {
                    this.sendError(res, e)
                })
            } catch (e) {
                this.sendError(res, e)
            }
        })

        app.get<string, any, HttpResponse<object>, GitHubCreateIssueBody, { repositoryName: string }>(route + "/CreateIssue", (req, res) => {
            logInfo("Start GitHub CreateIssue")
            try {
                createIssue(req.query.repositoryName, req.body).then((value) => {
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