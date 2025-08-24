export const dirname = __dirname;
import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";

import routes from "./routes";
import settings, { env_data } from "./utils";

const app: Application = express();

// settings
settings(app);

// routes
routes(app);

const PORT = env_data.PORT || 3000;

app.listen(PORT);
