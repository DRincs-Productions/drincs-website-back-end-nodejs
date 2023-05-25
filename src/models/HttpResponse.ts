import { StatusCodes } from "http-status-codes";

export class HttpResponse<T> {
    content?: T;
    messages: string = "";
    messagesAlert?: string;
    messagesToShow?: string;
    StatusCodes: StatusCodes = StatusCodes.OK;
}
