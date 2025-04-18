<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { getGuildFiles } from '@/api/guilds'
import type { GuildType } from '@/types/GuildTypes'
import { API_getSettings, API_saveSettings } from '@/api/presets'

const guilds = ref<GuildType[]>([])
const savedSelectedChannels = ref<string[]>([])
const selectedChannels = ref<string[]>([])

const guildsSorted = computed(() => {

  const guildsCopy = [...guilds.value] as GuildType[]
  const dupa = guildsCopy.sort((first, second) => {
    let score_first = 0
    let score_second = 0
    for (const channel of first.channelsDetails) {
      if (savedSelectedChannels.value.includes(channel.id)) {
        score_first += 1
      }
    }
    for (const channel of second.channelsDetails) {
      if (savedSelectedChannels.value.includes(channel.id)) {
        score_second += 1
      }
    }
    return score_second - score_first
  })
  return dupa
})

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
    const result = await API_getSettings()
    selectedChannels.value = result.repostChannels
    savedSelectedChannels.value = result.repostChannels
    guilds.value = body
  } catch (error) {
    window.alert('Backend is not running (likely)')
  }
})

const save = async () => {
  try {
    const result = await API_saveSettings({
      repostChannels: selectedChannels.value
    })
    savedSelectedChannels.value = result.repostChannels
  } catch (e) {
    console.error(e)
  }

}
</script>

<template>
  <main class="mx-auto min-w-96 p-8 gap-8 bg-gray-800 text-gray-200">
    <h1 class="text-4xl">Repoaster</h1>
    <p>Will take this channel and repoast all content posted on it onto a selected preset</p>
    <button class="btn btn-sm btn-outline btn-primary" @click="save">
      Save
    </button>
    <template v-if="guilds">
      <div class="collapse" v-for="guild in guildsSorted" :key="guild.guild.id">
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
