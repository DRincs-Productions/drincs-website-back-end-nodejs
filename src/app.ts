import bodyParser from "body-parser";
import express, { Express } from 'express';
import { TranslationController } from "./controllers/TranslationController";

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
new TranslationController(app, "api/translation")

app.get("/api", (req, res) => {
    console.info("Home")
    res.send("this is the drincs-website-back-end")
})

app.listen(port, () => console.info(`Server is running on port ${port}!`));

exports.app = firebase_functions.https.onRequest(app);
