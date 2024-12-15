import { ref, computed } from "vue"
import { areArraysDiff } from '@/utils/areArraysDiff'

type PresetType = Record<string, string[]>

interface LocalStorageType {
  type: PresetType[]
}
export const useLocalStorage = () => {
  const saveCurrentChannels = () => {
    try {
      localStorageItems.value = selectedChannels.value
      localStorage.setItem('channels', JSON.stringify(selectedChannels.value))
    } catch (e) {
      console.error(e)
    }
  }

  const getLocalChannels = () => {
    try {
      const channels = localStorage.getItem('channels')
      if (channels) return JSON.parse(channels)
    } catch (e) {
      console.error(e)
    }
  }

  const localStorageItems = ref<string[]>(getLocalChannels() || [])
  const selectedChannels = ref<string[]>(localStorageItems.value)
  const saveName = ref<string>('')

  const areLocalItemsDiff = computed(() => {
    return areArraysDiff(selectedChannels.value, localStorageItems.value)
  })

  return {
    saveCurrentChannels,
    getLocalChannels,
    localStorageItems,
    selectedChannels,
    areLocalItemsDiff,
    saveName
  }
}
