<script setup lang="ts">
import { getGuildFiles } from '@/services/getGuildFiles'
import { onMounted, ref } from 'vue'

type GuildType = {
  guild: {
    id: string
    name: string
    icon?: string
    channels: string[]
    files: string[]
  }

  channelsDetails: {
    id: string
    name: string
    type: string
  }[]
}

const guilds = ref<GuildType[]>([])

onMounted(async () => {
  const items = await getGuildFiles()
  const body = await items.json()
  guilds.value = body
  console.log(body)
})

const getChannelName = (index: number, channelId: string) => {
  const currentGuild = guilds.value[index]
  const channels = currentGuild?.channelsDetails
  const channelName = channels?.find((channel) => channel.id === channelId)?.name

  return channelName
}
</script>

<template>
  <main class="text-white">
    <RouterLink to="/upload"> Upload </RouterLink>
    guilds
    <div class="p-8 bg-gray-800 text-gray-200" v-for="(guild, index) in guilds">
      <div>{{ guild.guild.name }}</div>
      <template v-for="channel in guild.guild.channels" :key="channel">
        <div v-if="getChannelName(index, channel)">> {{ getChannelName(index, channel) }}</div>
      </template>
    </div>
  </main>
</template>
