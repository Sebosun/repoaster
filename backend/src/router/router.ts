import { Router } from "express";
import client from "@/discordjs";
import { postMediaOnChannel } from "../services/discord/postOnChannel";
import { upload } from "../services/multer";
import channels from "@/router/channels/channels";
import message from "@/router/message";
import { timeout } from "@/helpers/timeout";

const router = Router();

// TODO: Check out how to properly handle input validation
// I don't like manually checking it lol - zod?
router.post("/upload", upload.single("image"), async function (req, res) {
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
});

router.use("/channels", channels);
router.use("/message", message);

export default router;
