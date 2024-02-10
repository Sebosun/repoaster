import { Router } from "express";
import client from "@/discordjs";
import { postOnChannel } from "../services/discord/postOnChannel";
import { upload } from "../services/multer";
import channels from "@/router/channels/channels";
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

  try {
    const channels = JSON.parse(req.body.channels);

    for (const channel of channels) {
      await postOnChannel(client, channel, req.file.path, req.file.filename);
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

export default router;
