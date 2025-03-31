import { Request, Response } from "express";
import { presetSchema } from "@/schemas/presetSchema";
import { getSettings, updateSettings } from '@/helpers/useSettings'
import { STATUS_CODES } from '@/types/ResponseTypes'

export async function getPresets(_: Request, res: Response) {
    try {
        const settings = await getSettings()
        res.status(STATUS_CODES.OK);
        res.json(settings.presets);
    } catch (e) {
        res.status(STATUS_CODES.SERVER_ERROR);
        res.json({ message: "Error parsing JSON data" });
    }
}

export async function savePresets(req: Request, res: Response) {
    const input = presetSchema.safeParse(req.body);
    if (!input.success) {
        res.status(STATUS_CODES.INVALID_REQUEST);
        res.json({ message: "Invalid input" });
        return;
    }

    const { data } = input

    try {
        let newPresets = {
            presets: {}
        } as Record<string, Record<string, string[]>>

        data.forEach(el => {
            newPresets.presets[el.name] = el.channels
        })

        const newSettings = await updateSettings(newPresets)

        res.status(STATUS_CODES.INVALID_REQUEST);
        res.json(newSettings.presets);

    } catch (e) {
        console.error(e)
        res.status(STATUS_CODES.SERVER_ERROR);
        res.json({ message: "Error parsing JSON data" });
    }
}
