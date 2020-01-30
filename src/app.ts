import express = require("express");
import { urlRouter } from "./UrlRouter";
import * as bodyParser from 'body-parser';

// Our Express APP config
const app = express();
app.set("port", process.env.PORT || 3000);

app.use(bodyParser.text());
app.use("/", urlRouter);

// export our app
export default app;