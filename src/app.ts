import bodyParser from "body-parser";
import express, { Express } from 'express';
import { initializeApp } from "firebase/app";
import { TranslationController } from "./controllers/TranslationController";
import { logInfo, logTest } from "./utility/Logger";

// Initialize Firebase
let firebaseConfig = {
    apiKey: process.env.FIREBASE_WEBSITE_WEBAPI_APIKEY,
    authDomain: process.env.FIREBASE_WEBSITE_WEBAPI_AUTHDOMAIN,
    projectId: process.env.FIREBASE_WEBSITE_WEBAPI_PROJECTID,
    storageBucket: process.env.FIREBASE_WEBSITE_WEBAPI_STORAGEBUCKET,
    messagingSenderId: process.env.FIREBASE_WEBSITE_WEBAPI_MESSAGINGSENDERID,
    appId: process.env.FIREBASE_WEBSITE_WEBAPI_APPID,
    measurementId: process.env.FIREBASE_WEBSITE_WEBAPI_MEASUREMENTID,
};

initializeApp(firebaseConfig)

// env
let dotenv = require('dotenv');
let cors = require('cors');
let firebase_functions = require("firebase-functions");

dotenv.config();
const port = process.env.PORT || 5000;

const app: Express = express();

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// add routes
new TranslationController(app, "/api/translation")

app.get("/api", (req, res) => {
    logInfo("Home")
    res.send(`This is the drincs-website-back-end`)
})

app.get("/api/test/logger", (req, res) => {
    res.send(logTest())
})

app.listen(port, () => logInfo(`Server is running on port ${port}!`));

// * for firebase Hosting (now not used)
exports.app = firebase_functions.https.onRequest(app);
