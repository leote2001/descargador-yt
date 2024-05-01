import ytdl from "ytdl-core";
import { Request, Response } from "express";
import { LogError } from "./logger";
import ffmpeg from "ffmpeg-static";
import cp from "child_process";

export async function merge_download(req: Request, res: Response) {
    const url = req.query.url as string;
    const format = req.query.format as string;
    try {
        if (ffmpeg !== null) {
            const info = await ytdl.getInfo(url);
            const videoFormat = ytdl.chooseFormat(info.formats, { quality: format });
            const video: any = ytdl(url, { quality: format });
            const audio: any = ytdl(url, { quality: "highest", filter: "audioonly", highWaterMark: 1 << 25 });
            const ext = videoFormat.container;
            const filename = `${info.videoDetails.title}.${ext}`;
            const ffmpegProcess = cp.spawn(ffmpeg, [
                "-i", "pipe:3",
                "-i", "pipe:4",
                "-map", "0:v",
                "-map", "1:a",
                "-c:v", "copy",
                "-c:a", "copy",
                "-movflags", "frag_keyframe+empty_moov",
                "-f", `${ext}`,
                "-"
            ], {
                stdio: [
                    "pipe", "pipe", "pipe", "pipe", "pipe"
                ]
            });
            video.pipe(ffmpegProcess.stdio[3]);
            audio.pipe(ffmpegProcess.stdio[4]);
            res.header("content-disposition", `attachment; filename="${filename}"`);
            ffmpegProcess.stdio[1].pipe(res, {end: true});
        }
    } catch (err: any) {
        throw err;
    }
}
