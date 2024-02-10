import { Router } from "express";
import client from "@/discordjs";
import { postOnChannel } from "../services/discord/postOnChannel";
import { upload } from "../services/multer";
import channels from "@/router/channels/channels";

const router = Router();

// TODO: Check out how to properly handle input validation
// I don't like manually checking it lol - zod?
router.post("/upload", upload.single("image"), function (req, res) {
  if (!req.file) {
    res.status(400);
    res.json({ message: "Missing file" });
    return;
  }

  postOnChannel(
    client,
    "1127931845280026627",
    req.file.path,
    req.file.filename,
  );

  res.status(200);
  res.json();
});

router.use("/channels", channels);

export default router;
