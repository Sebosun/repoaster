import { ref, computed, watch } from 'vue'
import { areArraysSame } from '@/utils/areArraysDiff'

type PresetType = {
  name: string
  channels: string[]
}

export const useLocalStorage = () => {
  const savePreset = () => {
    try {
      const newType = {
        name: saveName.value,
        channels: selectedChannels.value
      }

      const localChannels = getLocalChannels()
      if (localChannels) {
        const channelsFiltered = localChannels.filter((item) => item.name !== saveName.value)
        const combineLocal = [...channelsFiltered, newType]
        localStorage.setItem('presets', JSON.stringify(combineLocal))
        localStorageItems.value = combineLocal
      } else {
        localStorage.setItem('presets', JSON.stringify([newType]))
        localStorageItems.value = [newType]
      }

      selectedPreset.value = saveName.value
    } catch (e) {
      console.error(e)
    }
  }

  const deletePreset = (presetName: string) => {
    const localChannels = getLocalChannels()
    if (!localChannels) return
    const channelsFiltered = localChannels?.filter((item) => item.name !== presetName)
    localStorage.setItem('presets', JSON.stringify(channelsFiltered))
    localStorageItems.value = channelsFiltered
    selectedPreset.value = ''
  }

  const getLocalChannels = () => {
    try {
      const channels = localStorage.getItem('presets')
      if (channels) return JSON.parse(channels) as PresetType[]
    } catch (e) {
      console.error(e)
    }
  }

  const localStorageItems = ref<PresetType[]>(getLocalChannels() || [])
  const selectedPreset = ref<string>(localStorageItems.value[0]?.name ?? '')
  const selectedChannels = ref<string[]>(localStorageItems.value[0]?.channels || [])
  const saveName = ref<string>(localStorageItems.value[0]?.name ?? '')

  const currentPreset = computed(() => {
    return localStorageItems.value.find((item) => item.name === selectedPreset.value)
  })

  watch(selectedPreset, (newSelection) => {
    const findChannel = localStorageItems.value.find((item) => item.name === newSelection)?.channels
    selectedChannels.value = findChannel ?? []
    saveName.value = newSelection
  })

  const areLocalItemsSame = computed(() => {
    const findCurChannel = currentPreset.value?.channels
    if (!findCurChannel) return false
    if (saveName.value !== selectedPreset.value) return false
    return areArraysSame(selectedChannels.value, findCurChannel ?? [])
  })

  return {
    savePreset,
    deletePreset,
    getLocalChannels,
    localStorageItems,
    currentPreset,
    selectedChannels,
    areLocalItemsSame,
    saveName,
    selectedPreset
  }
}
