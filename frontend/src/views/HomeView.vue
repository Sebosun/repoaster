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
  try {
    const items = await getGuildFiles()
    const body = await items.json()
    guilds.value = body
    console.log(body)
  } catch (error) {
    console.error(error)
    window.alert('Backend is not running (likely)')
  }
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
        <div v-if="guilds" class="collapse" v-for="(guild, index) in guilds">
          <input type="checkbox" />
          <div class="collapse-title text-xl font-medium">{{ guild.guild.name }}</div>
          <div class="collapse-content">
            <template v-for="channel in guild.guild.channels" :key="channel">
              <div v-if="getChannelName(index, channel)">
                <label class="label cursor-pointer">
                  <input
                    class="checkbox checkbox-primary"
                    type="checkbox"
                    :id="channel"
                    :value="channel"
                    v-model="checkedChannels"
                  />
                  <span class="text-lg">{{ getChannelName(index, channel) }} </span>
                </label>
              </div>
            </template>
          </div>
        </div>
      </div>
      <UploadFile :target-channels="checkedChannels" />
    </div>
  </main>
</template>
