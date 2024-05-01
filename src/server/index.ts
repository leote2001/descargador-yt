import express, {Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
const app: Express = express();

app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true, limit: "50 mb" }));
app.use(express.json({ limit: "50 mb" }));

export {app};