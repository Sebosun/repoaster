import { constructURL } from '@/api/helpers'

export type Preset = {
  name: string
  channels: string[]
}

type ResultPreset = Record<string, string[]>

export type SettingsResponse = {
  presets: ResultPreset
  repostChannels: string[]
}

export const API_savePresets = (preset: Preset[]) => {
  const endpoint = constructURL('/presets')
  const payload = JSON.stringify(preset)

  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: payload
  })
}

export const API_getPresets = () => {
  const endpoint = constructURL('/presets')
  return fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

interface SaveSettingsPayload {
  presets?: Preset
  repostChannels?: string[]
}

export const API_getSettings = async () => {
  const endpoint = constructURL('/settings')
  const result = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const settingsJSONED = (await result.json()) as SettingsResponse
  return settingsJSONED
}

export const API_saveSettings = async (updatedSettings: SaveSettingsPayload) => {
  const endpoint = constructURL('/settings')
  const result = await fetch(endpoint, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedSettings)
  })
  const settingsJSONED = (await result.json()) as SettingsResponse
  return settingsJSONED
}
