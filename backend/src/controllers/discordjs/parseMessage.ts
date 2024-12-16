import { AnyChannel, Client, Message } from 'discord.js-selfbot-v13'
import { prepareMessageData } from '@/helpers/discordjs/prepareMessage'

type OptionsType = {
  command?: '/repoast',
  mode?: "instagram" | "repoast",
  link?: string,
  preset?: string
  message?: string
}

const options: OptionsType = {
  command: undefined,
  mode: undefined,
  link: "",
  preset: "",
  message: undefined
}


export const parseMessage = async (
  discordMessage: Message<boolean>,
  client: Client<boolean>,
) => {
  if (discordMessage.author.id !== client.user?.id) return

  const channel = client.channels.cache.get(discordMessage.channelId)
  const { message } = prepareMessageData(discordMessage, channel)


  const inputSplit = message.split(" ")

  inputSplit.forEach((cur, idx) => {
    if (cur.startsWith('/')) {
      const commandExists = Boolean(options.command)
      if (commandExists) {
        throw new Error("Command already exists, wrong input")
      }

      if (cur === '/repoast') {
        options.command = cur
      }
      return
    }

    const prev = inputSplit[idx - 1]
    const next = inputSplit[idx + 1]

    const prevAndCurAreFlags = prev?.startsWith('--') && cur.startsWith('--')
    const curAndNextAreFlags = next?.startsWith('--') && cur.startsWith('--')
    if (prevAndCurAreFlags || curAndNextAreFlags) {
      throw new Error("Cur and next or prev command starts with --, wrong input")
    }

    if (cur === '--instagram') {
      options.mode = 'instagram'
      options.link = next
    }

    if (cur === '--preset') {
      options.preset = next
    }
  })

  console.log(options)
}
