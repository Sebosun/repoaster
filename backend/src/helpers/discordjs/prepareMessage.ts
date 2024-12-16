import { AnyChannel, Client, Message } from 'discord.js-selfbot-v13'
import type { SavedMessage } from '@/types/DiscordTypes'

export const prepareMessageData = (
  message: Message,
  channel: AnyChannel | undefined
): SavedMessage => {
  let messageObj: SavedMessage = {
    message: message.content,
    message_id: message.id,
    channelId: message.channelId,
    username: message.author.username,
    author_id: message.author.id,
  }

  const mentionUser = message.mentions.repliedUser

  if (channel?.type != 'DM' && channel) {
    messageObj.channel_name = channel.name
  }

  if (mentionUser && message.reference) {
    messageObj.mention_username = mentionUser.username
    messageObj.mention_id = mentionUser.id
    messageObj.mention_reference = message.reference?.messageId
  }

  return messageObj
}

