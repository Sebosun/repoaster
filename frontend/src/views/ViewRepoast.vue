<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { getGuildFiles } from '@/api/guilds'
import type { GuildType } from '@/types/GuildTypes'
import { API_getSettings, API_saveSettings } from '@/api/presets'
import SearchInput from '@/components/SearchInput.vue'

const guilds = ref<GuildType[]>([])
const savedSelectedChannels = ref<string[]>([])
const selectedChannels = ref<string[]>([])
const searchChannel = ref('')

const guildSortedByFavorites = computed(() => {
  const guildsCopy = [...guilds.value] as GuildType[]
  const collection = guildsCopy.sort((first, second) => {
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

  return collection
})

const guildsFiltered = computed(() => {
  const acc = [] as GuildType[]
  for (const guild of guildSortedByFavorites.value) {
    const filteredChannels = guild.guild.channels.filter((channel) => {
      const channelName = getChannelName(guild, channel)
      return channelName?.includes(searchChannel.value)
    })

    if (filteredChannels.length <= 0) {
      continue
    }

    const guildReturn = {
      guild: { ...guild.guild, channels: filteredChannels },
      channelsDetails: guild.channelsDetails
    }
    acc.push(guildReturn)
  }
  return acc

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
    <div class="flex justify-between flex-end">
      <div>
        <h1 class="text-4xl">Repoaster</h1>
        <p>Will take this channel and repoast all content posted on it onto a selected preset</p>
      </div>
      <button class="btn btn-xl btn-primary text-2xl font-medium" @click="save">
        Save
      </button>
    </div>

    <SearchInput class="w-full my-4" v-model="searchChannel" />

    <template v-if="guilds">
      <TransitionGroup name="list" tag="div">
        <div class="collapse" v-for="guild in guildsFiltered" :key="guild.guild.id">
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
      </TransitionGroup>

    </template>
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
</style>
