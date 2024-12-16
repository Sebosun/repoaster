import { findNewestFile, getNewFileName } from "@/helpers/getNewFileName";
import { spawn } from "child_process";
import path from 'path'
import { homedir } from 'os'

export type CallbackType = (code: number | null, filePath: string, newNameAsFile: string) => Promise<void> | void

const maxSize = 8
const maxFileSize = `${maxSize}M`
const home = homedir()

export function ytdlp(link: string, callback: CallbackType): void {
  const newName = getNewFileName()
  const ytDLPPath = `~/.local/share/upload/instagram/${newName}.%(ext)s`

  const ls = spawn('yt-dlp', ['--max-filesize', maxFileSize, '-o', ytDLPPath, link]);

  ls.on('close', async (code) => {
    const newNameAsFile = findNewestFile()
    const filePath = path.join(home, ".local", 'share', 'upload', 'instagram', newNameAsFile)
    callback(code, filePath, newNameAsFile)
  })
}
