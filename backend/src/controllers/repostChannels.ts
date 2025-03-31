import { Request, Response } from "express";
import { repostChannelsSchema } from "@/schemas/repostChannelsSchema"
import { STATUS_CODES } from "@/types/ResponseTypes";
import { getSettings, updateSettings } from "@/helpers/useSettings"


export async function getRepostChannels(_: Request, res: Response) {
    try {
        const settings = await getSettings()
        res.status(STATUS_CODES.OK)
        res.json(settings)
    } catch (e) {
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
        const settings = await updateSettings({
            repostChannels: body.data.channels
        })
        res.status(STATUS_CODES.OK)
        res.json({ channels: settings.repostChannels })
        return
    } catch (e) {
        res.status(STATUS_CODES.SERVER_ERROR);
        res.json({ message: "Something went wrong" });
        return
    }
}

