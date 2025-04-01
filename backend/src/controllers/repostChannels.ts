import { Request, Response } from "express";
import { repostChannelsSchema } from "@/schemas/repostChannelsSchema"
import { STATUS_CODES } from "@/types/ResponseTypes";
import { settings } from "@/helpers/useSettings";

export async function getRepostChannels(_: Request, res: Response) {
    try {
        const sets = await settings.getSettings()
        res.status(STATUS_CODES.OK)
        res.json(sets)
    } catch {
        res.status(STATUS_CODES.SERVER_ERROR);
        res.json({ message: "Something went wrong" });
        return
    }
}

export async function saveRepostsChannels(req: Request, res: Response) {
    const body = repostChannelsSchema.safeParse(req.body);

    if (!body.success) {
        res.status(STATUS_CODES.INVALID_REQUEST);
        res.json({ message: "Invalid request" });
        return;
    }

    try {
        const sets = await settings.updateSettings({
            repostChannels: body.data.channels
        })
        res.status(STATUS_CODES.OK)
        res.json({ channels: sets.repostChannels })
        return
    } catch (e) {
        console.error(e)
        res.status(STATUS_CODES.SERVER_ERROR);
        res.json({ message: "Something went wrong" });
        return
    }
}

