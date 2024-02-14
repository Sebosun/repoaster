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

const guilds = ref<GuildType[]>([])

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

onMounted(async () => {
  try {
    const items = await getGuildFiles()
    const body = await items.json()
    guilds.value = body
  } catch (error) {
    window.alert('Backend is not running (likely)')
  }
})

const getChannelName = (index: number, channelId: string) => {
  const currentGuild = guilds.value[index]
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
</script>

<template>
  <main class="text-white mx-auto min-w-96 w-full">
    <div class="grid grid-cols-2 p-8 gap-8 bg-gray-800 text-gray-200">
      <div>
        <div class="flex items-center gap-4" v-if="selectedChannels?.length && !areLocalItemsDiff">
          <label class="form-control w-full max-w-xs">
            <input
              type="text"
              placeholder="Filter by name..."
              class="input input-bordered w-full max-w-xs"
            />
          </label>
          <button class="btn" @click="saveCurrentChannels">Save</button>
        </div>
        <div v-if="guilds" class="collapse" v-for="(guild, index) in guilds">
          <input type="checkbox" />
          <div class="collapse-title text-xl font-medium bg-base-200 rounded-md my-4">
            {{ guild.guild.name }}
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
