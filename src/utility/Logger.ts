import { Logtail } from "@logtail/node";

export function logInfo(message: string, body: any = undefined) {
    if (process.env.NODE_ENV === 'production') {
        try {
            let logtail = new Logtail(process.env.LOGTAIL_WEBAPI_KEY || "");
            logtail.info(message, body);
            return
        }
        catch (ex) { }
    }

    console.info(message, body)
}


export function logWarn(message: string, body: any = undefined) {
    if (process.env.NODE_ENV === 'production') {
        try {
            let logtail = new Logtail(process.env.LOGTAIL_WEBAPI_KEY || "");
            logtail.warn(message, body);
            return
        }
        catch (ex) { }
    }

    console.info(message, body)
}

export function logError(message: string, body: any = undefined) {
    if (process.env.NODE_ENV === 'production') {
        try {
            let logtail = new Logtail(process.env.LOGTAIL_WEBAPI_KEY || "");
            logtail.error(message, body);
            return
        }
        catch (ex) { }
    }

    console.info(message, body)
}

export function logTest(): string {
    // if (process.env.NODE_ENV !== 'production') {
    //     return "it is not a production environment"
    // }
    try {
        let logtail = new Logtail(process.env.LOGTAIL_WEBAPI_KEY || "");
        logtail.info("test", {});
        return true.toString()
    }
    catch (ex) {
        return false.toString()
    }
}