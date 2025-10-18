export type ChannelType = {
  id: string
  name: string
  type: string
  parentId: string
}

export type GuildType = {
  guild: {
    id: string
    name: string
    icon?: string
    channels: string[]
    files: string[]
    ownerId: string
  }

  channelsDetails: ChannelType[]
}
