import { readFile, writeFile } from 'node:fs/promises'
import { getUserDataLocation } from "@/helpers/useLocations";

export interface SaveData {
    presets?: Record<string, string[]>
    repostChannels?: string[]
}

const savedDataPath = getUserDataLocation()

const useSettings = () => {
    async function getSettings(): Promise<SaveData> {
        const data = await readFile(savedDataPath, "utf-8")
        return JSON.parse(data) as SaveData
    }

    async function updateSettings(settings: Partial<SaveData>) {
        try {
            const curSettings = await getSettings()
            if (settings.presets) curSettings.presets = settings.presets
            if (settings.repostChannels) curSettings.repostChannels = settings.repostChannels

            const new_saved_items = JSON.stringify(curSettings)
            await writeFile(savedDataPath, new_saved_items)
            return curSettings
        } catch (e) {
            console.error("Error updating settings")
            throw e
        }
    }

    async function getPresetByName(name: string) {
        try {
            const settings = await getSettings()
            if (!settings.presets) return

            return settings.presets[name]

        } catch (e) {
            console.error("Error parsing preset")
            throw e
        }
    }

    return {
        getSettings,
        updateSettings,
        getPresetByName
    }
}


const settings = useSettings()

export {
    settings
}
