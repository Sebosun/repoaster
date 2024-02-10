import { Client, TextChannel } from "discord.js-selfbot-v13";

export const getChannels = async (client: Client, channelIds: string[]) => {
  const channelsReduced = channelIds.reduce((acc, channelId) => {
    const channel = client.channels.cache.get(channelId);
    if (channel instanceof TextChannel) {
      acc.push(channel);
    }
    return acc;
  }, [] as Array<TextChannel>);

  return channelsReduced;
};
