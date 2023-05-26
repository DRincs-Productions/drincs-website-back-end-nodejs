export class MyError implements Error {
    constructor(messageToShow: string, preMessage: string) {
        this.messageToShow = messageToShow
        this.message = preMessage + " " + messageToShow
    }
    name: string = "MyError"
    message: string = ""
    messageToShow: string = ""
    stack?: string;
}
