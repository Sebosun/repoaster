import { Request, Response } from "express";
import client from "@/discordjs";
import { postMessageOnChannel } from "@/services/discord/postOnChannel";
import { messageSchema } from "@/schemas/messageSchema";
import { STATUS_CODES } from "@/types/ResponseTypes";

export async function sendDiscordMsg(req: Request, res: Response) {
    const input = messageSchema.safeParse(req.body);
    if (!input.success) {
        res.status(STATUS_CODES.INVALID_REQUEST);
        res.json({ message: "Invalid input" });
        return;
    }

    const { message, channels } = input.data;

    try {
        for (const channel of channels) {
            await postMessageOnChannel(client, channel, message);
        }
        res.status(STATUS_CODES.OK);
        res.json();
    } catch (e) {
        console.error(e)
        res.status(STATUS_CODES.SERVER_ERROR);
        res.json({ message: "Something went wrong" });
    }
}
