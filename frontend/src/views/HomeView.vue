<script setup lang="ts">
import UploadFile from '@/components/UploadFile.vue'
import PostMessage from '@/components/PostMessage.vue'
import { getGuildFiles } from '@/services/getGuildFiles'
import { onMounted, ref } from 'vue'
import { areArraysDiff } from '@/utils/areArraysDiff'
import { computed } from '@vue/reactivity'

type ChannelType = {
  id: string
  name: string
  type: string
}

type GuildType = {
  guild: {
    id: string
    name: string
    icon?: string
    channels: string[]
    files: string[]
  }

  channelsDetails: ChannelType[]
}

const guildsArray = ref<GuildType[]>([])
const searchChannel = ref('')

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

const guildsFiltered = computed(() => {
  return guildsArray.value.map((guild, index) => {
    const newChannels = guild.guild.channels.filter((channel) => {
      const channelName = getChannelName(index, channel)
      return channelName?.includes(searchChannel.value)
    })

    const guildReturn = {
      guild: { ...guild.guild, channels: newChannels },
      channelsDetails: guild.channelsDetails
    }
    return guildReturn
  })
})

onMounted(async () => {
  try {
    const items = await getGuildFiles()
    const body = await items.json()
    guildsArray.value = body
  } catch (error) {
    window.alert('Backend is not running (likely)')
  }
})

const getChannelName = (index: number, channelId: string) => {
  const currentGuild = guildsArray.value[index]
  const channels = currentGuild?.channelsDetails
  const channelName = channels?.find((channel) => channel.id === channelId)?.name

  return channelName
}

const saveCurrentChannels = () => {
  try {
    /* TODO: notfis */
    localStorageItems.value = selectedChannels.value
    localStorage.setItem('channels', JSON.stringify(selectedChannels.value))
  } catch (e) {
    console.error(e)
  }
}

const areLocalItemsDiff = computed(() => {
  return areArraysDiff(selectedChannels.value, localStorageItems.value)
})

const getSelectedChannelDetails = computed(() => {
  /* { id: string, name: string} */
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
</script>

<template>
  <main class="text-white mx-auto min-w-96 w-full">
    <label class="ml-8 input input-bordered flex items-center gap-2 max-w-96 my-5">
      <input
        type="text"
        class="grow bg-inherit input-bordered input-primary"
        placeholder="Search"
        v-model="searchChannel"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        class="w-4 h-4 opacity-70"
      >
        <path
          fill-rule="evenodd"
          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
          clip-rule="evenodd"
        />
      </svg>
    </label>
    <div class="grid grid-cols-2 p-8 gap-8 bg-gray-800 text-gray-200">
      <div>
        <div class="flex flex-wrap items-center gap-4" v-if="selectedChannels?.length">
          Sending to:
          <div class="kbd" v-for="channel in getSelectedChannelsNames">
            {{ channel }}
          </div>
          <button class="btn" :disabled="areLocalItemsDiff" @click="saveCurrentChannels">
            Save
          </button>
        </div>
        <div v-if="guildsArray" class="collapse" v-for="(guild, index) in guildsFiltered">
          <input type="checkbox" />
          <div class="collapse-title text-xl font-medium bg-base-200 rounded-md my-4">
            {{ guild.guild.name }}
            <span class="opacity-50"> ({{ guild.guild.channels.length }}) </span>
          </div>
          <div class="collapse-content">
            <template v-for="channel in guild.guild.channels" :key="channel">
              <div v-if="getChannelName(index, channel)">
                <label class="label cursor-pointer">
                  <input
                    class="checkbox checkbox-primary"
                    type="checkbox"
                    :id="channel"
                    :value="channel"
                    v-model="selectedChannels"
                  />
                  <span class="text-lg">{{ getChannelName(index, channel) }} </span>
                </label>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div>
        <UploadFile :target-channels="selectedChannels" />
        <PostMessage class="mt-8" :target-channels="selectedChannels" />
      </div>
    </div>
  </main>
</template>
