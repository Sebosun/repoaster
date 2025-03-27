<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getGuildFiles } from '@/services/getGuildFiles'
import type { GuildType } from '@/types/GuildTypes'

const guildsArray = ref<GuildType[]>([])
const selectedChannels = ref<string[]>([])

const getChannelName = (guild: GuildType, channelId: string) => {
  const channels = guild?.channelsDetails
  const channelName = channels?.find((channel) => channel.id === channelId)?.name

  return channelName
}

const selectedCount = (guild: GuildType): number => {
  let count = 0
  guild.channelsDetails.forEach((guild) => {
    for (const item of selectedChannels.value) {
      if (item === guild.id) {
        count++
      }
    }
  })

  return count
}

onMounted(async () => {
  try {
    const items = await getGuildFiles()
    const body = await items.json()
    guildsArray.value = body
  } catch (error) {
    window.alert('Backend is not running (likely)')
  }
})

const save = () => {
  console.log('save')
}
</script>

<template>
  <main class="mx-auto min-w-96 p-8 gap-8 bg-gray-800 text-gray-200">
    <h1 class="text-4xl">Repoaster</h1>
    <p>Will take this channel and repoast all content posted on it onto a selected preset</p>
    <button class="btn btn-sm btn-outline btn-primary" @click="save">
      Save
    </button>
    <template v-if="guildsArray">
      <div class="collapse" v-for="guild in guildsArray" :key="guild.guild.id">
        <input type="checkbox" />

        <div class="collapse-title flex text-xl font-medium bg-base-200 rounded-md my-4 pr-6">
          {{ guild.guild.name }}
          <span class="opacity-50"> ({{ guild.guild.channels.length }}) </span>
          <span class="ml-auto"> ⭐ {{ selectedCount(guild) }}</span>
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
    </template>
  </main>
</template>
