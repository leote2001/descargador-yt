import { LogError, LogSuccess } from "./src/utils/logger";
import { rootRouter} from "./src/routes";
import { videoRouter} from "./src/routes";
import {Request, Response} from "express";
import {app} from "./src/server";
import dotenv from "dotenv";
dotenv.config();

app.use("/", rootRouter);
app.use("/video", videoRouter);

const port: string | number = process.env.PORT || 3001;
app.listen(port, () => {
    LogSuccess(`Escuchando en el puerto ${port}`);
});
app.on("error", (error: any) => {
    LogError(`Ha ocurrido un error inesperado - ${error}`);
});