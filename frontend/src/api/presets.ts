const baseURL = 'http://localhost:3000'

type Preset = {
  name: string
  channels: string[]
}

export const API_savePresets = (preset: Preset[]) =>
  fetch(`${baseURL}/presets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(preset)
  })

export const API_getSettings = () =>
  fetch(`${baseURL}/presets`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
