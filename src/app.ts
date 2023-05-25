import bodyParser from "body-parser";
import express, { Express } from 'express';
import { TranslationController } from "./controllers/TranslationController";

// env
let dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 5000;

const app: Express = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// add routes
new TranslationController(app, "api/translation")

app.listen(port, () => console.info(`Server is running on port ${port}!`));
