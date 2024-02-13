import client from "@/discordjs";
import express from "express";
import { postMessageOnChannel } from "@/services/discord/postOnChannel";
import { messageSchema } from "@/schemas/messageSchema";

const router = express.Router();

router.post("", async (req, res) => {
  const input = messageSchema.safeParse(req.body);
  if (!input.success) {
    res.status(400);
    res.json({ message: "Invalid input" });
    return;
  }

  const { message, channels } = input.data;

  try {
    for (const channel of channels) {
      await postMessageOnChannel(client, channel, message);
    }
  } catch (e) {
    res.status(500);
    res.json({ message: "Something went wrong" });
    return;
  }
});

export default router;
