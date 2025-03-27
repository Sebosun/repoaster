import { readFile, writeFile } from 'node:fs/promises'
import { getUserDataLocation } from "@/helpers/useLocations";

export interface SaveData {
    presets?: Record<string, string[]>
}

const savedDataPath = getUserDataLocation()

export async function getSettings(): Promise<SaveData> {
    try {
        const data = await readFile(savedDataPath, "utf-8")
        return JSON.parse(data) as SaveData
    } catch (e) {
        throw e
    }
}

export async function updateSettings(newSettings: Partial<SaveData>) {
    try {
        const settings = await getSettings()
        if (newSettings.presets) settings.presets = newSettings.presets

        const new_saved_items = JSON.stringify(settings)
        await writeFile(savedDataPath, new_saved_items)
        return settings
    } catch (e) {
        console.error("Error updating settings")
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
