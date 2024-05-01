import express, {Router, Request, Response } from "express";
import { LogInfo, LogSuccess } from "../utils/logger";
import { VideoController } from "../controllers/VideoController";
import ytdl from "ytdl-core";

const rootRouter: Router = express.Router();
const videoRouter: Router = express.Router();

rootRouter.get("/", (req: Request, res: Response) => {
    res.send("Bienvenido al descargador de Youtube!");
});
// Rutas video.
videoRouter.get("/details", async (req: Request, res: Response) => {
    const VC: VideoController = new VideoController();
    const url: any = req.query.url;
    LogInfo(`Query param url=${url}`);
    try {
        const videoDetails = await VC.getVideoDetails(url);
        res.status(200).json(videoDetails);
    } catch(err: any) {
        res.status(500).json({"Error": err.message});
    }
});

videoRouter.get("/formats", async (req: Request, res: Response) => {
    const VC: VideoController = new VideoController();
    const url: any = req.query.url;
    const format: any = req.query.format;
    LogInfo(`Query params url=${url}, format=${format}`);
    try {
        const videoFormats = await VC.getFormats(url, format);
        res.status(200).json(videoFormats);
    } catch(err: any) {
        res.status(500).json({"Error": err.message});
    }
});

videoRouter.get("/download", async (req: Request, res: Response) => {
    const VC: VideoController = new VideoController();
    const url: any = req.query.url;
    const format: any = req.query.format;
    try {
        const info = await ytdl.getInfo(url);
        const formatoElegido = ytdl.chooseFormat(info.formats, {quality: format});
        if (formatoElegido.isLive) {
            throw new Error("No se pueden descargar videos en vivo");
        }
        await VC.downloadVideo(req, res);
        LogSuccess(`Descarga de ${info.videoDetails.title}`);
    } catch(err: any) {
        res.status(500).json({"Error": err.message});
    }
});

videoRouter.get("/wav-mp3", async (req: Request, res: Response) => {
const VC: VideoController = new VideoController();
const url: any = req.query.url; 
try {
const info = await ytdl.getInfo(url);
const formatoElegido = ytdl.chooseFormat(info.formats, {quality: "highest", filter: "audioonly"});
if (formatoElegido.isLive) {
    throw new Error("No se pueden descargar videos en vivo");
}
await VC.toWavOrMp3(req, res);
} catch(err: any) {
    res.status(500).json({"Error": err.message});
}
});
export {rootRouter, videoRouter};