import { Request, Response } from "express";
import client from "@/discordjs";
import { postMediaOnChannel, postMessageOnChannel } from "@/services/discord/postOnChannel";
import { instagramSchema } from "@/schemas/instagramSchema";
import { spawn } from "child_process";
import { getNewFileName } from "@/helpers/getNewFileName";
import { timeout } from "@/helpers/timeout";
import { homedir } from 'os'
import path from 'path'

const maxSize = 8
const maxFileSize = `${maxSize}M`
const home = homedir()

export async function sendInstagram(req: Request, res: Response) {
  const input = instagramSchema.safeParse(req.body);
  if (!input.success) {
    res.status(400);
    res.json({ message: "Invalid input" });
    return;
  }

  const { link, channels } = input.data;
  console.log("Sending instagram link ", link)
  const newName = getNewFileName()
  const newNameAsFile = `${newName}.mp4`
  const ytDLPPath = `~/.local/share/upload/instagram/${newName}.%(ext)s`
  const ls = spawn('yt-dlp', ['--max-filesize', maxFileSize, '-o', ytDLPPath, link]);

  // TODO: This is a wild guess lmao, will need to run a function and check the latest item ig, good for now
  const filePath = path.join(home, ".local", 'share', 'upload', 'instagram', newNameAsFile)

  console.log("File saved under: ", filePath)

  ls.on('close', async (code) => {
    if (code === 1) {
      res.status(500);
      res.json({ message: "Couldnt download reel" });
      return
    }

    for (const channel of channels) {
      await postMediaOnChannel(client, channel, filePath, newNameAsFile);
      await timeout(Math.floor(Math.random() * 431));
    }
    res.status(200);
    res.json();
  })
}
