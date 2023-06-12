import bodyParser from "body-parser";
import express, { Express } from 'express';
import { AuthController } from "./controllers/AuthController";
import { GitHubController } from "./controllers/GitHubController";
import { TranslationController } from "./controllers/TranslationController";
import { logInfo, logTest } from "./utility/Logger";

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
new GitHubController(app, "/api/github")
new AuthController(app, "/api/auth")

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
