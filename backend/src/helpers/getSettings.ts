import path from "path";
const savedDataPath = path.resolve(__dirname, "../saved_data.json")
import { readFile } from 'node:fs/promises'

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
