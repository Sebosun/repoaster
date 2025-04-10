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

    const { presets, repostChannels } = schema.data

    const settingsPayload: Partial<SaveData> = {}
    if (presets) {
        settingsPayload.presets = {}
        for (const el of presets) {
            if (settingsPayload.presets) {
                settingsPayload.presets[el.name] = el.channels
            }
        }
    }

    if (repostChannels) {
        settingsPayload.repostChannels = repostChannels
    }

    try {
        const sets = await settings.updateSettings(settingsPayload)
        res.status(STATUS_CODES.OK)
        res.json(sets)
    } catch (e) {
        console.error(e)
        res.status(STATUS_CODES.SERVER_ERROR)
        res.json({ message: "Something went wrong" })
    }
}

export async function getSettings(_: Request, res: Response) {
    try {
        const usrSettings = await settings.getSettings()
        res.status(STATUS_CODES.OK)
        res.json(usrSettings)
        return
    } catch (e) {
        console.error(e)
        res.status(STATUS_CODES.SERVER_ERROR)
        res.json({ message: "Something went wrong" })
    }
}
