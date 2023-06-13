import * as admin from "firebase-admin";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";

export function initializeFirebaseApp() {
    initializeApp({
        apiKey: process.env.FIREBASE_WEBSITE_WEBAPI_APIKEY,
        authDomain: process.env.FIREBASE_WEBSITE_WEBAPI_AUTHDOMAIN,
        projectId: process.env.FIREBASE_WEBSITE_WEBAPI_PROJECTID,
        storageBucket: process.env.FIREBASE_WEBSITE_WEBAPI_STORAGEBUCKET,
        messagingSenderId: process.env.FIREBASE_WEBSITE_WEBAPI_MESSAGINGSENDERID,
        appId: process.env.FIREBASE_WEBSITE_WEBAPI_APPID,
        measurementId: process.env.FIREBASE_WEBSITE_WEBAPI_MEASUREMENTID,
    })
    // https://cloud.google.com/docs/authentication/application-default-credentials?hl=it#GAC
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_WEBSITE_WEBAPI_PROJECTID,
            clientEmail: process.env.FIREBASE_WEBSITE_WEBAPI_CREDENTIALS_CLIENTEMAIL,
            privateKey: process.env.FIREBASE_WEBSITE_WEBAPI_CREDENTIALS_PRIVATEKEY?.replaceAll("\\n", "\n"),
        })
    })
}

export function getFirebaseAnalytics() {
    // https://stackoverflow.com/questions/59400315/is-it-possible-to-setup-firebase-analytics-from-an-express-server
    try {
        return getAnalytics()
    }
    catch (ex) {
        console.error("getFirebaseAnalytics", ex)
        throw Error("getFirebaseAnalytics")
    }
}

export function getFirebaseAuth() {
    try {
        return admin.auth()
    }
    catch (ex) {
        console.error("getFirebaseAuth", ex)
        throw Error("getFirebaseAuth")
    }
}
