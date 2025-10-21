import { Client, TextChannel } from "discord.js-selfbot-v13";

export const getChannels = async (client: Client, channelIds: string[]) => {
  const acc = [] as Array<TextChannel>;

  for (const ch of channelIds) {
    const channel = client.channels.cache.get(ch);
    if (channel instanceof TextChannel) {
      acc.push(channel);
    }
  }

  return acc;
};
