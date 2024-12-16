export type SavedMessage = {
  message: string
  message_id?: string | null
  channel_name?: string | null
  channelId?: string | null
  username?: string | null
  author_id?: string | null
  mention_username?: string | null
  mention_id?: string | null
  mention_reference?: string | null
  attachement_types?: string[] | null
  attachement_urls?: string[] | null
}

