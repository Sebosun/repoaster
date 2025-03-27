import { Request, Response } from "express";
import { presetSchema } from "@/schemas/presetSchema";
import path from "path";
import { writeFile } from 'node:fs/promises'
import { getSettings, updateSettings } from '@/helpers/useSettings'
import { getUserDataLocation } from "@/helpers/useLocations";

const savedDataPath = getUserDataLocation()

export async function getPresets(_: Request, res: Response) {
    try {
        const settings = await getSettings()
        res.status(200);
        res.json(settings.presets);
    } catch (e) {
        res.status(500);
        res.json({ message: "Error parsing JSON data" });
    }
}

export async function savePresets(req: Request, res: Response) {
    const input = presetSchema.safeParse(req.body);
    if (!input.success) {
        res.status(400);
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

        res.status(200);
        res.json(newSettings.presets);

    } catch (e) {
        console.error(e)
        res.status(500);
        res.json({ message: "Error parsing JSON data" });
    }
}
