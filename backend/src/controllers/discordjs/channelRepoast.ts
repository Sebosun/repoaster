import { Client, Message } from 'discord.js-selfbot-v13'
/* import { prepareMessageData } from '@/helpers/discordjs/prepareMessage' */

function handleReferenceRepost(
    message: Message<boolean>,
    client: Client<boolean>,
) {
    console.log("Handle reference repost", message, client)
}

function handleMessageRepost(
    message: Message<boolean>,
    client: Client<boolean>,
) {
    console.log("Handle repost", message, client)
}

export async function channelRepoast(
    message: Message<boolean>,
    client: Client<boolean>,
) {
    /* console.log('Message: ', message) */
    console.log('Message: ', message.content)
    console.log('Attachements ', message.attachments)
    if (message.reference) {
        handleReferenceRepost(message, client)
        return
    }

    handleMessageRepost(message, client)

}
