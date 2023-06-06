import { StatusCodes } from "http-status-codes";

export function generatedSuccesResult<T>(content?: T, messages?: string, messagesToShow?: string, statusCode: StatusCodes = StatusCodes.OK) {
    return new HttpResponse(statusCode, messages, messagesToShow, content)
}

export class HttpResponse<T> {
    constructor(statusCode: StatusCodes, messages?: string, messagesToShow?: string, content?: T) {
        this.statusCodes = statusCode
        this.messages = messages ? messages : "Status " + this.statusCodes;
        this.content = content;
        this.messagesToShow = messagesToShow;
        if (this.statusCodes >= 400) {
            this.isSuccessStatusCode = false
        }
        else {
            this.isSuccessStatusCode = true
        }
    }

    content?: T;
    messages: string | string[] = "";
    messagesToShow?: string;
    statusCodes: StatusCodes = StatusCodes.OK;
    isSuccessStatusCode: boolean = true;
}
