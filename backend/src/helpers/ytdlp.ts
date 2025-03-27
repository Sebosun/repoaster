import { findNewestFile, getNewFileName } from "@/helpers/getNewFileName";
import { getInstagramLocation, getYTDLPLocation } from "@/helpers/useLocations";
import { spawn } from "child_process";
import path from 'path'

export type CallbackType = (code: number | null, filePath: string, newNameAsFile: string) => Promise<void> | void

const maxSize = 8
const maxFileSize = `${maxSize}M`

export function ytdlp(link: string, callback: CallbackType): void {
    const newName = getNewFileName()
    const ytDLPPath = getYTDLPLocation(newName)
    const ls = spawn('yt-dlp', ['--max-filesize', maxFileSize, '-o', ytDLPPath, link]);

    ls.on('close', async (code) => {

        const newNameAsFile = findNewestFile()
        const filePath = path.join(getInstagramLocation(), newNameAsFile)
        callback(code, filePath, newNameAsFile)
    })
}
