import { Request, Response } from "express";
import { presetSchema } from "@/schemas/presetSchema";
import path from "path";
import { writeFile } from 'node:fs/promises'
import { getSettings } from '@/helpers/getSettings'


const savedDataPath = path.resolve(__dirname, "../saved_data.json")

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
        const settings = await getSettings()

        if (!settings.presets) settings.presets = {}

        data.forEach(el => {
            if (settings.presets) {
                settings.presets[el.name] = el.channels
            }
        })

        const new_saved_items = JSON.stringify(settings)

        await writeFile(savedDataPath, new_saved_items)

        res.status(200);
        res.json(settings.presets);

    } catch (e) {
        console.error(e)
        res.status(500);
        res.json({ message: "Error parsing JSON data" });
    }
}
