import { Request, Response } from "express";
import client from "@/discordjs";
import { postMessageOnChannel } from "@/services/discord/postOnChannel";
import { messageSchema } from "@/schemas/messageSchema";

export async function sendDiscordMsg(req: Request, res: Response) {
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
        res.status(200);
        res.json();
    } catch (e) {
        res.status(500);
        res.json({ message: "Something went wrong" });
    }
}
