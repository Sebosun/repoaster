<script setup lang="ts">
import UploadFile from '@/components/UploadFile.vue'
import { getGuildFiles } from '@/services/getGuildFiles'
import { onMounted, ref } from 'vue'

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
const checkedChannels = ref<[]>([])

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
    <div class="grid grid-cols-2 p-8 bg-gray-800 text-gray-200">
      <div>
        <div v-for="(guild, index) in guilds">
          <div>{{ guild.guild.name }}</div>
          <template v-for="channel in guild.guild.channels" :key="channel">
            <div class="flex gap-4 text-2xl" v-if="getChannelName(index, channel)">
              <input type="checkbox" :id="channel" :value="channel" v-model="checkedChannels" />
              <label :for="getChannelName(index, channel)">{{
                getChannelName(index, channel)
              }}</label>
            </div>
          </template>
        </div>
      </div>
      <UploadFile :target-channels="checkedChannels" />
    </div>
  </main>
</template>
