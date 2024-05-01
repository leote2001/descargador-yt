import { IVideoController } from "./interfaces";
import { LogSuccess, LogError } from "../utils/logger";
import ytdl, { VideoDetails, videoFormat, Filter } from "ytdl-core";
import { Request, Response } from "express";
import ffmpegStatic from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import { merge_download } from "../utils/merge_download";
ffmpegStatic !== null && ffmpeg.setFfmpegPath(ffmpegStatic);

export class VideoController implements IVideoController {
    public async getVideoDetails(url: string): Promise<VideoDetails> {
        try {
            const info = await ytdl.getInfo(url);
            const videoDetalles: any = info.videoDetails;
            LogSuccess("Datos del video " + info.videoDetails.title);
            return videoDetalles;
        } catch (err: any) {
            LogError(err.message);
            throw err;
        }
    }
    public async getFormats(url: string, format: string): Promise<videoFormat[]> {
        try {
            const info = await ytdl.getInfo(url);
            const formats = ytdl.filterFormats(info.formats, format as Filter);
            LogSuccess(`Formatos de ${format} del video ${info.videoDetails.title}`);
            return formats;
        } catch (err: any) {
            LogError(err.message);
            throw err;
        }
    }
    public async downloadVideo(req: Request, res: Response): Promise<void> {
        const url = req.query.url as string;
        const format = req.query.format as string;
        try {
            const info = await ytdl.getInfo(url);
            const videoStream = ytdl(url, { quality: format });
            const formatoElegido = ytdl.chooseFormat(info.formats, { quality: format });
            const ext = ytdl.chooseFormat(info.formats, { quality: format }).container;
            if (formatoElegido.hasAudio && formatoElegido.hasVideo || formatoElegido.hasAudio && !formatoElegido.hasVideo) {
                res.setHeader("content-disposition", `attachment; filename="${info.videoDetails.title}.${ext}"`);
                videoStream.pipe(res, { end: true });
                console.log("usando la función downloadVideo");
            } else {
                await merge_download(req, res);
                console.log("Usando la función merge_download");
            }
        } catch (err: any) {
            LogError(err.message);
            throw err;
        }
    }
    public async toWavOrMp3(req: Request, res: Response): Promise<void> {
        const url = req.query.url as string;
        const format = req.query.format as string;
        try {
            const info = await ytdl.getInfo(url);
            const audioTitle = info.videoDetails.title;
            const audioStream: any = ytdl(url, { quality: "highest", filter: "audioonly" });
            const filename = `${audioTitle}.${format}`;
            res.header("content-disposition", `attachment; filename="${filename}"`);
            const ffmpegCommand = ffmpeg(audioStream);
            ffmpegCommand.format(format);
            if (format == "mp3") {
                ffmpegCommand.audioBitrate(320);
            }
            ffmpegCommand.pipe(res, { end: true });
            LogSuccess(`Conversión a ${format} del audio del video ${audioTitle}`);
        } catch (err: any) {
            LogError(err.message);
            throw err;
        }
    }
}
