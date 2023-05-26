export class ServiceResponse<T> {
    constructor(messages: string = "", isSuccesful: boolean = true, messagesToShow?: string, content?: T) {
        this.messages = messages
        this.messagesToShow = messagesToShow
        this.isSuccesful = isSuccesful
        this.content = content
    }

    content?: T;
    messages: string = ""
    messagesToShow?: string
    isSuccesful: boolean
}
