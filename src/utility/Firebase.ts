import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";

function firebaseConfig() {
    return {
        apiKey: process.env.FIREBASE_WEBSITE_WEBAPI_APIKEY,
        authDomain: process.env.FIREBASE_WEBSITE_WEBAPI_AUTHDOMAIN,
        projectId: process.env.FIREBASE_WEBSITE_WEBAPI_PROJECTID,
        storageBucket: process.env.FIREBASE_WEBSITE_WEBAPI_STORAGEBUCKET,
        messagingSenderId: process.env.FIREBASE_WEBSITE_WEBAPI_MESSAGINGSENDERID,
        appId: process.env.FIREBASE_WEBSITE_WEBAPI_APPID,
        measurementId: process.env.FIREBASE_WEBSITE_WEBAPI_MEASUREMENTID,
    };
}

export const firebaseApp = initializeApp(firebaseConfig())

export function getFirebaseAnalytics() {
    try {
        return getAnalytics(firebaseApp);
    }
    catch {
        return
    }
}