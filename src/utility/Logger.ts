
import { getAnalytics, logEvent } from "firebase/analytics";

export function logInfo(message: string, body: any = undefined) {
    if (process.env.NODE_ENV === 'production') {
        try {
            let analytics = getAnalytics();
            logEvent(analytics, 'info', {
                message: message,
                body: body,
            });
            return
        } catch (ex) { }
    }

    console.info(message, body)
}

export function logTrace(message: string, body: any = undefined) {
    if (process.env.NODE_ENV === 'production') {
        try {
            let analytics = getAnalytics();
            logEvent(analytics, 'trace', {
                message: message,
                body: body,
            });
            return
        } catch (ex) { }
    }

    console.info(message, body)
}

export function logWarn(message: string, body: any = undefined) {
    if (process.env.NODE_ENV === 'production') {
        try {
            let analytics = getAnalytics();
            logEvent(analytics, 'trace', {
                message: message,
                body: body,
            });
            return
        } catch (ex) { }
    }

    console.info(message, body)
}

export function logError(message: string, body: any = undefined) {
    if (process.env.NODE_ENV === 'production') {
        try {
            let analytics = getAnalytics();
            logEvent(analytics, 'trace', {
                message: message,
                body: body,
            });
            return
        } catch (ex) { }
    }

    console.info(message, body)
}

export function logTest(): string {
    if (process.env.NODE_ENV !== 'production') {
        return "it is not a production environment"
    }
    try {
        let analytics = getAnalytics();
        logEvent(analytics, 'test', {
            message: "test",
            body: {},
        });
        return true.toString()
    } catch (ex) {
        return false.toString()
    }
}