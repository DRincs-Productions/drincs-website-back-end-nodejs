import { Express, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HttpResponse } from '../models/HttpResponse';
import { MyError } from '../models/MyError';
import { logInfo } from '../utility/Logger';

abstract class ControllerInterface {
    constructor(app: Express, route: string) {
        this.app = app
        this.route = route
        logInfo("Route added: " + route)
    }
    private app: Express
    private route: string

    protected sendError<T>(res: Response<HttpResponse<T>>, e: any | Error, statusCode: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR): void {
        let messages: string = ""
        let messagesToShow: string | undefined = undefined
        if (e instanceof MyError) {
            messages = e.message
            messagesToShow = e.messageToShow
        }
        else if (e instanceof Error) {
            messages = e.message
        }
        let value = new HttpResponse<T>(statusCode, messages, messagesToShow)
        res.status(statusCode).send(value)
    }
}

export default ControllerInterface;