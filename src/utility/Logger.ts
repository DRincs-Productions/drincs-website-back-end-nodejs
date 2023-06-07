
import { logEvent } from "firebase/analytics";
import { getFirebaseAnalytics } from "./Firebase";

export function logInfo(message: string, body: any = undefined) {
    if (process.env.NODE_ENV === 'production') {
        let analytics = getFirebaseAnalytics();
        if (analytics) {
            logEvent(analytics, 'info', {
                message: message,
                body: body,
            });
            return
        }
    }

    console.info(message, body)
}

export function logTrace(message: string, body: any = undefined) {
    if (process.env.NODE_ENV === 'production') {
        let analytics = getFirebaseAnalytics();
        if (analytics) {
            logEvent(analytics, 'trace', {
                message: message,
                body: body,
            });
            return
        }
    }

    console.info(message, body)
}

export function logWarn(message: string, body: any = undefined) {
    if (process.env.NODE_ENV === 'production') {
        let analytics = getFirebaseAnalytics();
        if (analytics) {
            logEvent(analytics, 'trace', {
                message: message,
                body: body,
            });
            return
        }
    }

    console.info(message, body)
}

export function logError(message: string, body: any = undefined) {
    if (process.env.NODE_ENV === 'production') {
        let analytics = getFirebaseAnalytics();
        if (analytics) {
            logEvent(analytics, 'trace', {
                message: message,
                body: body,
            });
            return
        }
    }

    console.info(message, body)
}

export function logTest(): string {
    if (process.env.NODE_ENV !== 'production') {
        return "it is not a production environment"
    }
    let analytics = getFirebaseAnalytics();
    if (analytics) {
        logEvent(analytics, 'test', {
            message: "test",
            body: {},
        });
        return true.toString()
    }
    else {
        return false.toString()
    }
}