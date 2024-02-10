import type {
  Client,
  PartialGroupDMChannel,
  TextChannel,
} from "discord.js-selfbot-v13";

export const getChannels = async (client: Client, channelIds: string[]) => {
  const channelsReduced = channelIds.reduce(
    (acc, channelId) => {
      const channel = client.channels.cache.get(channelId);
      if (channel?.type === "GUILD_TEXT") {
        acc.push(channel);
      }
      return acc;
    },
    [] as Array<TextChannel | PartialGroupDMChannel>,
  );

  return channelsReduced;
};
