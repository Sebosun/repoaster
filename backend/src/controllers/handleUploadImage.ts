import { Request, Response } from "express";
import client from "@/discordjs";
import { postMediaOnChannel } from "../services/discord/postOnChannel";
import { timeout } from "@/helpers/timeout";

export async function handleUploadImage(req: Request, res: Response) {
  if (!req.file) {
    res.status(400);
    res.json({ message: "Missing file" });
    return;
  }

  if (!req.body.channels) {
    res.status(400);
    res.json({ message: "Missing channels" });
    return;
  }

  if (!req.body.message) {
    res.status(400);
    res.json({ message: "Missing message" });
    return;
  }

  try {
    const channels = JSON.parse(req.body.channels);
    const message = JSON.parse(req.body.message) as string | undefined;

    for (const channel of channels) {
      await postMediaOnChannel(
        client,
        channel,
        req.file.path,
        req.file.filename,
        message,
      );
      await timeout(Math.floor(Math.random() * 1000));
    }
  } catch (e) {
    res.status(500);
    res.json({ message: "Something went wrong" });
    return;
  }

  res.status(200);
  res.json();
}
