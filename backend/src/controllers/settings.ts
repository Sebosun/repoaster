import { Request, Response } from "express";
import { settingsSchema } from "@/schemas/settingsSchema"
import { STATUS_CODES } from "@/types/ResponseTypes";
import { settings } from "@/helpers/useSettings"
import type { SaveData } from "@/helpers/useSettings"


export async function saveSettings(req: Request, res: Response) {
    const schema = settingsSchema.safeParse(req.body)
    if (!schema.success) {
        res.json({ message: "Invalid request" })
        res.json(STATUS_CODES.INVALID_REQUEST)
        return
    }

    const { presets, repoastChannels } = schema.data

    const newSettingsPayload: Partial<SaveData> = {}
    if (presets) {
        newSettingsPayload.presets = {}
        for (const el of presets) {
            if (newSettingsPayload.presets) {
                newSettingsPayload.presets[el.name] = el.channels

            }
        }
    }

    if (repoastChannels) {
        newSettingsPayload.repostChannels = repoastChannels
    }

    try {
        const sets = await settings.updateSettings(newSettingsPayload)
        res.status(STATUS_CODES.SERVER_ERROR)
        res.json(sets)
    } catch (e) {
        console.error(e)
        res.status(STATUS_CODES.SERVER_ERROR)
        res.json({ message: "Something went wrong" })
    }
}

/* export async function getSettings(_: Request, res: Response) { } */
