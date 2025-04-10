/* TODO: move into env or something */
const baseURL = 'http://localhost:3000'

export type Preset = {
  name: string
  channels: string[]
}

type ResultPreset = Record<string, string[]>

export type SettingsResponse = {
  presets: ResultPreset
  repostChannels: string[]
}


export const API_savePresets = (preset: Preset[]) =>
  fetch(`${baseURL}/presets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(preset)
  })

export const API_getPresets = () =>
  fetch(`${baseURL}/presets`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })


interface SaveSettingsPayload {
  presets?: Preset
  repostChannels?: string[]
}

export const API_getSettings = async () => {
  const result = await fetch(`${baseURL}/settings`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })

  const settingsJSONED = await result.json() as SettingsResponse
  return settingsJSONED
}

export const API_saveSettings = async (updatedSettings: SaveSettingsPayload) => {
  const result = await fetch(`${baseURL}/settings`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedSettings)
  })
  const settingsJSONED = await result.json() as SettingsResponse
  return settingsJSONED
}
