import client from "@/discordjs";
import { Request, Response } from "express";
import { repoastSchema } from '@/schemas/repoastSchema'
import { getPresetByName } from "@/helpers/getSettings";
import { ytdlp } from '@/helpers/ytdlp'
import { postMediaOnChannel } from "@/services/discord/postOnChannel";
import { timeout } from "@/helpers/timeout";

const default_preset = "test"

export async function repoastReel(req: Request, res: Response) {
    // TODO: add preset to schema
    const input = repoastSchema.safeParse(req.body);

    if (!input.success) {
        res.status(400);
        res.json({ message: "Invalid input" });
        return;
    }

    const { link } = input.data

    let channels

    try {
        channels = await getPresetByName(default_preset)
    } catch (e) {
        console.error(e)
        res.status(500);
        res.json({ message: "Couldn't parse settings" });
        return
    }

    if (!channels) {
        res.status(400);
        res.json({ message: "No channels available for given preset" });
        return

    }

    ytdlp(link, async (code, filePath, newNameAsFile) => {
        if (code === 1) {
            res.status(500);
            res.json({ message: "Couldnt download reel" });
            return
        }

        try {
            for (const channel of channels) {
                await postMediaOnChannel(client, channel, filePath, newNameAsFile);
                await timeout(Math.floor(Math.random() * 431));
            }
            res.status(200);
            res.json();
        } catch (e) {
            res.status(500);
            res.json({ message: "Couldnt download or upload reel" });
            return
        }
    })

}
