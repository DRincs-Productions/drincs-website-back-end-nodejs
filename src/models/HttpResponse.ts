import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "./ServiceResponse";

export function generatedResponseByServiceResponse<T>(serviceResponse: ServiceResponse<T>, statusCode?: StatusCodes, messages?: string) {
    statusCode = statusCode ? statusCode : serviceResponse.isSuccesful ? StatusCodes.OK : StatusCodes.BAD_REQUEST
    let res = new HttpResponse<T>(statusCode)

    res.content = serviceResponse.content;
    res.messagesToShow = serviceResponse.messagesToShow;
    if (messages) {
        res.messages = messages
    }
    else if (serviceResponse.isSuccesful) {
        res.messages = "Ok";
    }
    else {
        res.messages = "Error";
    }
}

export class HttpResponse<T> {
    constructor(statusCode: StatusCodes, messages?: string, messagesToShow?: string, content?: T) {
        this.statusCodes = statusCode
        this.messages = messages ? messages : "Status " + this.statusCodes;
        this.content = content;
        this.messagesToShow = messagesToShow;
    }

    content?: T;
    messages: string | string[] = "";
    messagesToShow?: string;
    statusCodes: StatusCodes = StatusCodes.OK;
}
