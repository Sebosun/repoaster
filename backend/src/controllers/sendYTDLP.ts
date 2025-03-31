import { Request, Response } from "express";
import client from "@/discordjs";
import { postMediaOnChannel } from "@/services/discord/postOnChannel";
import { instagramSchema } from "@/schemas/instagramSchema";
import { timeout } from "@/helpers/timeout";
import { ytdlp } from '@/helpers/ytdlp'
import { STATUS_CODES } from "@/types/ResponseTypes";

export async function sendYTDLP(req: Request, res: Response) {
  const input = instagramSchema.safeParse(req.body);
  if (!input.success) {
    res.status(STATUS_CODES.INVALID_REQUEST);
    res.json({ message: "Invalid input" });
    return;
  }

  const { link, channels } = input.data;

  ytdlp(link, async (code, filePath, newNameAsFile) => {
    if (code === 1) {
      res.status(STATUS_CODES.SERVER_ERROR);
      res.json({ message: "Couldnt download reel" });
      return
    }

    try {
      for (const channel of channels) {
        await postMediaOnChannel(client, channel, filePath, newNameAsFile);
        await timeout(Math.floor(Math.random() * 431));
      }
      res.status(STATUS_CODES.OK);
      res.json();
    } catch (e) {
      res.status(STATUS_CODES.SERVER_ERROR);
      res.json({ message: "Couldnt download reel" });
      return
    }
  })

}

