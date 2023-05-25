export class ServiceResponse<T> {
    constructor(messages: string = "", messagesToShow?: string, content?: T, isSuccesful: boolean = true) {
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
