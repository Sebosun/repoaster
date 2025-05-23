<script setup lang="ts">
import SearchInput from '@/components/SearchInput.vue'
import UploadFile from '@/components/UploadFile.vue'
import InstagramForm from '@/components/InstagramForm.vue'
import { getGuildFiles } from '@/api/guilds'
import { onMounted, ref, computed } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { API_savePresets } from '@/api/presets'
import type { GuildType, ChannelType } from '@/types/GuildTypes'

type Options = {
  type: 'message' | 'ytdlp'
}

const options = ref<Options>({
  type: 'ytdlp'
})
const guildsArray = ref<GuildType[]>([])
const searchChannel = ref('')
const expandAll = ref<boolean>(false)

const {
  localStorageItems,
  selectedChannels,
  savePreset,
  deletePreset,
  areLocalItemsSame,
  saveName,
  selectedPreset,
  currentPreset
} = useLocalStorage()

const savePresetBackend = async () => {
  if (!currentPreset.value) return
  console.log(currentPreset.value)
  try {
    await API_savePresets(localStorageItems.value)
  } catch (e) {
    console.error(e)
  }
}

const isInPreset = (guild: GuildType): boolean => {
  return guild.channelsDetails.some((item) =>
    currentPreset.value?.channels.some((el) => el === item.id)
  )
}

const selectedCount = (guild: GuildType): number => {
  let count = 0
  guild.channelsDetails.forEach((item) => {
    if (!currentPreset.value) return
    currentPreset.value?.channels.forEach((localGuild) => {
      if (item.id === localGuild) {
        count++
      }
    })
  })

  return count
}

const guildsFiltered = computed<GuildType[]>(() => {
  const acc = [] as GuildType[]

  for (const guild of guildsArray.value) {
    const newChannels = guild.guild.channels.filter((channel) => {
      const channelName = getChannelName(guild, channel)
      return channelName?.includes(searchChannel.value)
    })

    if (newChannels.length <= 0) {
      continue
    }

    const guildReturn = {
      guild: { ...guild.guild, channels: newChannels },
      channelsDetails: guild.channelsDetails
    }
    acc.push(guildReturn)
  }

  if (searchChannel.value.length > 0) {
    acc.sort((_, second) => second.guild.channels.length)
  }

  acc.sort((guild1, guild2) => {
    const isFirstInPreset = isInPreset(guild1)
    const isSecondInPreset = isInPreset(guild2)

    if (isFirstInPreset && !isSecondInPreset) {
      return -1
    }

    if (!isFirstInPreset && isSecondInPreset) {
      return 1
    }

    if (isFirstInPreset && isSecondInPreset) {
      const guild1Count = selectedCount(guild1)
      const guild2Count = selectedCount(guild2)
      return guild1Count > guild2Count ? -1 : 1
    }

    return -1
  })

  return acc
})

const getChannelName = (guild: GuildType, channelId: string) => {
  const channels = guild?.channelsDetails
  const channelName = channels?.find((channel) => channel.id === channelId)?.name

  return channelName
}

const getSelectedChannelDetails = computed(() => {
  const acc = [] as ChannelType[]
  // possible perfm issues with larger amount of channels?
  guildsArray.value.forEach((guild) => {
    selectedChannels.value.forEach((item) => {
      const channel = guild.channelsDetails.find((channel) => channel.id === item)
      if (channel) acc.push(channel)
    })
  })
  return acc
})

const getSelectedChannelsNames = computed(() =>
  getSelectedChannelDetails.value.map((item) => item.name)
)

onMounted(async () => {
  try {
    const items = await getGuildFiles()
    const body = await items.json()
    guildsArray.value = body
  } catch (error) {
    window.alert('Backend is not running (likely)')
  }
})
</script>

<template>
  <main class="text-white mx-auto min-w-96 w-full">
    <div class="grid grid-cols-2 p-8 gap-8 bg-gray-800 text-gray-200">
      <div>
        <div class="mt-4 flex gap-4 items-center justify-between">
          <div>
            Selected preset: <span class="font-bold"> {{ selectedPreset }} </span>
          </div>
          <button class="btn btn-sm btn-outline btn-error" @click="deletePreset(selectedPreset)">
            Delete current preset
          </button>
        </div>
        <h1 class="font-bold text-xl mt-4">Presets</h1>
        <div class="flex flex-wrap gap-4 my-4">
          <button @click="selectedPreset = ''" class="badge badge-warning">Reset</button>

          <button @click="selectedPreset = item.name" class="badge badge-info" v-for="item in localStorageItems"
            :key="item.name">
            {{ item.name }}
          </button>
        </div>
        <div class="flex items-center gap-4">
          <label class="input flex items-center gap-2 max-w-96 my-5">
            <input type="text" class="grow bg-inherit input-bordered input-primary" placeholder="Preset name"
              v-model="saveName" />
          </label>

          <button class="btn btn-info" :disabled="areLocalItemsSame" @click="savePreset">
            Save
          </button>

          <button class="btn btn-info" :disabled="areLocalItemsSame" @click="savePresetBackend">
            Save Preset On The Backend
          </button>
        </div>

        <div class="flex">
          <SearchInput class="w-full" v-model="searchChannel" />
          <div class="btn btn-neutral text-lg w-[25%] ml-2 px-4 self-center text-center cursor-pointer"
            @click="expandAll = !expandAll">
            <Transition name="pop-up" mode="out-in">
              <div v-if="!expandAll">
                Expand all
              </div>
              <div v-else>
                Hide
              </div>
            </Transition>
          </div>
        </div>

        <template v-if="guildsArray">
          <TransitionGroup name="list" tag="div">
            <div class="collapse" :class="{ 'collapse-open': expandAll }" v-for="guild in guildsFiltered"
              :key="guild.guild.id">
              <input type="checkbox" />

              <div class="collapse-title flex text-xl font-medium bg-base-200 rounded-md my-4 pr-6">
                {{ guild.guild.name }}
                <span class="opacity-50"> ({{ guild.guild.channels.length }}) </span>
                <span class="ml-auto" v-if="isInPreset(guild)"> ⭐ {{ selectedCount(guild) }}</span>
              </div>

              <div class="collapse-content">
                <template v-for="channel in guild.guild.channels" :key="channel">
                  <div v-if="getChannelName(guild, channel)">
                    <label class="label cursor-pointer">
                      <input class="checkbox checkbox-primary" type="checkbox" :id="channel" :value="channel"
                        v-model="selectedChannels" />
                      <span class="text-lg">{{ getChannelName(guild, channel) }} </span>
                    </label>
                  </div>
                </template>
              </div>
            </div>

          </TransitionGroup>
        </template>
      </div>

      <div>
        <div class="flex gap-4 justify-end">
          <button class="btn btn-sm" :class="{ 'btn-accent': options.type === 'message' }"
            @click="options.type = 'message'">
            Message/File
          </button>
          <button class="btn btn-sm" :class="{ 'btn-accent': options.type === 'ytdlp' }" @click="options.type = 'ytdlp'">
            ytdlp
          </button>
        </div>
        <h1 class="text-4xl py-5 text-center">Repoast content</h1>
        <UploadFile v-if="options.type === 'message'" :target-channels="selectedChannels" />

        <InstagramForm v-else-if="options.type === 'ytdlp'" :target-channels="selectedChannels" />
        <div class="mt-2">
          Sending to channels
          <div class="mt-2">
            <span class="kbd kbd-sm ml-1" v-for="name in getSelectedChannelsNames" :key="name">
              {{ name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(45px);
}


.pop-up-enter-active,
.pop-up-leave-active {
  transition: all 0.2s ease;
}

.pop-up-enter-from {
  opacity: 0;
  transform: translateY(-25px);
}
.pop-up-leave-to {
  opacity: 0;
  transform: translateY(25px);
}
</style>
