import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "./ServiceResponse";

export function generatedResponseByServiceResponse<T>(serviceResponse: ServiceResponse<T>, statusCode?: StatusCodes, messages?: string) {
    statusCode = statusCode ? statusCode : serviceResponse.isSuccesful ? StatusCodes.OK : StatusCodes.BAD_REQUEST
    let res = new HttpResponse<T>(statusCode)

    res.content = serviceResponse.content;
    res.messagesAlert = serviceResponse.messages;
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
    constructor(statusCode: StatusCodes, messages?: string, messagesAlert: string = "", content?: T) {
        this.statusCodes = statusCode
        this.messages = messages ? messages : "Status " + this.statusCodes;
        this.messagesAlert = messagesAlert;
        this.content = content;
    }

    content?: T;
    messages: string | string[] = "";
    messagesAlert: string = "";
    messagesToShow?: string;
    statusCodes: StatusCodes = StatusCodes.OK;
}
