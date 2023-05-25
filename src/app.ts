import express, { Express } from 'express';
import bodyParser from "body-parser";

// env
let dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 5000;

const app: Express = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.listen(port, () => console.log(`⚡️[server]: Server is running on port ${port}!`));
