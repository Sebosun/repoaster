import { Client, Message } from 'discord.js-selfbot-v13'
import { prepareMessageData } from '@/helpers/discordjs/prepareMessage'

type OptionsType = {
    command?: '/repoast',
    mode?: "instagram" | "repoast",
    link?: string,
    preset?: string
    message?: string
}

// 2025-03-27
// This doesn't work properly
// Leaving it be, but it isn't being used
export const parseSelfCommand = async (
    discordMessage: Message<boolean>,
    client: Client<boolean>,
) => {
    const options: OptionsType = {
        command: undefined,
        mode: undefined,
        link: "",
        preset: "",
        message: undefined
    }

    // case where userbot is not the one sending the message
    if (discordMessage.author.id !== client.user?.id) return

    const channel = client.channels.cache.get(discordMessage.channelId)
    const { message } = prepareMessageData(discordMessage, channel)

    // Case where it's not a command
    if (!message.startsWith('/')) {
        return
    }

    const inputSplit = message.split(" ")

    for (const [idx, cur] of inputSplit.entries()) {
        if (cur.startsWith('/')) {
            const commandExists = Boolean(options.command)
            if (commandExists) {
                throw new Error("Command already exists, wrong input")
            }

            if (cur === '/repoast') {
                options.command = cur
            }
            continue
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
    }

    console.log(options)
}
