import { Request, Response } from "express";
import client from "@/discordjs";
import {
  postMediaOnChannel,
  postMessageOnChannel,
} from "../services/discord/postOnChannel";
import { timeout } from "@/helpers/timeout";

export async function uploadImage(req: Request, res: Response) {
  if (!req.file && !req.body.message) {
    res.status(400);
    res.json({ message: "Missing file or message" });
    return;
  }

  if (!req.body.channels) {
    res.status(400);
    res.json({ message: "Missing channels" });
    return;
  }

  try {
    const channels = JSON.parse(req.body.channels);
    let message = req.body.message;
    if (message) {
      try {
        message = JSON.parse(req.body.message)
      } catch (e) {
        throw new Error("Couldnt parse JSON message")
      }
    }

    const filePath = req.file?.path;
    const fileName = req.file?.filename;
    const hasFile = !!filePath && !!fileName;

    for (const channel of channels) {
      if (!hasFile && message) {
        await postMessageOnChannel(client, channels, message);
      } else if (hasFile) {
        await postMediaOnChannel(client, channel, filePath, fileName, message);
      }
      await timeout(Math.floor(Math.random() * 431));
    }
  } catch (e) {
    console.error(e);
    res.status(500);
    res.json({ message: "Something went wrong" });
    return;
  }

  res.status(200);
  res.json();
}
