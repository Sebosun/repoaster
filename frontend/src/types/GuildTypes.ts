export type ChannelType = {
  id: string
  name: string
  type: string
}

export type GuildType = {
  guild: {
    id: string
    name: string
    icon?: string
    channels: string[]
    files: string[]
  }

  channelsDetails: ChannelType[]
}
