import {videoFormat, VideoDetails} from "ytdl-core";
import { Request, Response } from "express";

export interface IVideoController {
    getVideoDetails(url: string): Promise<VideoDetails>;
    getFormats(url: string, format: string): Promise<videoFormat[]>; 
    downloadVideo(req: Request, res: Response): Promise<void>;
    toWavOrMp3(req: Request, res: Response): Promise<void>
}