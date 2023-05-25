import { StatusCodes } from "http-status-codes";

// constructor(ServiceResponse<T> serviceResponse)
// {
//     Content = serviceResponse.Content;
//     MessagesAlert = serviceResponse.Messages;
//     MessagesToShow = serviceResponse.MessagesToShow;
//     if (serviceResponse.IsSuccesful) {
//         StatusCode = HttpStatusCode.OK;
//         Messages = "Ok";
//     }
//     else {
//         StatusCode = HttpStatusCode.BadRequest;
//         Messages = "Error";
//     }
// }
// constructor(ServiceResponse < T > serviceResponse, HttpStatusCode statusCode, string messages)
// {
//     Content = serviceResponse.Content;
//     MessagesAlert = serviceResponse.Messages;
//     StatusCode = statusCode;
//     Messages = messages;
// }

export function generatedResponseByServiceResponse<T>(serviceResponse: ServiceResponse<T>, statusCode?: StatusCodes, messages?: string) {
    statusCode = statusCode ? statusCode : serviceResponse.IsSuccesful ? StatusCodes.OK : StatusCodes.BAD_REQUEST
    let res = new HttpResponse<T>(statusCode)

    Content = serviceResponse.Content;
    MessagesAlert = serviceResponse.Messages;
    MessagesToShow = serviceResponse.MessagesToShow;
    if (serviceResponse.IsSuccesful) {
        Messages = "Ok";
    }
    else {
        Messages = "Error";
    }
}

export class HttpResponse<T> {
    constructor(statusCode: StatusCodes, messages?: string = "", messagesAlert?: string = "", content?: T | undefined) {
        this.statusCodes = statusCode
        this.messages = messages ? messages : "Status " + this.statusCodes;
        this.messages = messages;
        this.messagesAlert = messagesAlert;
        this.content = content;
    }

    content?: T;
    messages: string | string[] = "";
    messagesAlert?: string;
    messagesToShow?: string;
    statusCodes: StatusCodes = StatusCodes.OK;
}
