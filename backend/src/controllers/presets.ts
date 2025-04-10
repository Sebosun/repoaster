import { Request, Response } from "express";
import { presetSchema } from "@/schemas/presetSchema";
import { settings } from '@/helpers/useSettings'
import { STATUS_CODES } from '@/types/ResponseTypes'

export async function getPresets(_: Request, res: Response) {
    try {
        const sets = await settings.getSettings()
        res.status(STATUS_CODES.OK);
        res.json(sets.presets);
    } catch {
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
        const updatedPresets = {
            presets: {}
        } as Record<string, Record<string, string[]>>

        for (const el of data) {
            updatedPresets.presets[el.name] = el.channels
        }

        const updatedSettings = await settings.updateSettings(updatedPresets)

        res.status(STATUS_CODES.INVALID_REQUEST);
        res.json(updatedSettings.presets);

    } catch (e) {
        console.error(e)
        res.status(STATUS_CODES.SERVER_ERROR);
        res.json({ message: "Error parsing JSON data" });
    }
}
