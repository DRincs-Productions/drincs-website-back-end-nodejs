import * as admin from "firebase-admin";
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

const firebaseApp = initializeApp(firebaseConfig())

// https://cloud.google.com/docs/authentication/application-default-credentials?hl=it#GAC
if (process.env.WEBAPI_GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({
        credential: admin.credential.cert(process.env.WEBAPI_GOOGLE_APPLICATION_CREDENTIALS)
    })
}

export function getFirebaseAnalytics() {
    // https://stackoverflow.com/questions/59400315/is-it-possible-to-setup-firebase-analytics-from-an-express-server
    try {
        return getAnalytics(firebaseApp)
    }
    catch (ex) {
        throw Error("getFirebaseAnalytics")
    }
}

export function getFirebaseAuth() {
    try {
        return admin.auth()
    }
    catch (ex) {
        throw Error("getFirebaseAnalytics")
    }
}
