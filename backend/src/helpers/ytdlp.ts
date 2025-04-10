import { findNewestFile, getNewFileName } from "@/helpers/getNewFileName";
import { getInstagramLocation, getYTDLPLocation } from "@/helpers/useLocations";
import { spawn } from "child_process";
import path from 'path'

export type CallbackType = (code: number | null, filePath: string, nameAsFile: string) => Promise<void> | void

const maxSize = 8
const maxFileSize = `${maxSize}M`

export function ytdlp(link: string, callback: CallbackType): void {
    const fileName = getNewFileName()
    const ytDLPPath = getYTDLPLocation(fileName)
    const ls = spawn('yt-dlp', ['--max-filesize', maxFileSize, '-o', ytDLPPath, link]);

    ls.on('close', async (code) => {
        const fileName = findNewestFile()
        const filePath = path.join(getInstagramLocation(), fileName)
        callback(code, filePath, fileName)
    })
}
