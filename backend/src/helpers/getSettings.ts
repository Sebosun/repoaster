import path from "path";
const savedDataPath = path.resolve(__dirname, "../saved_data.json")
import { readFile } from 'node:fs/promises'
import { PartialWebhookMixin } from "discord.js-selfbot-v13";

export interface SaveData {
    presets?: Record<string, string[]>
}

export async function getSettings(): Promise<SaveData> {
    try {
        const data = await readFile(savedDataPath, "utf-8")
        return JSON.parse(data) as SaveData
    } catch (e) {
        throw e
    }
}

export async function getPresetByName(name: string) {
    try {
        const settings = await getSettings()
        if (!settings.presets) return

        return settings.presets[name]

    } catch (e) {
        console.error("Error parsing preset")
        throw e
    }
}
