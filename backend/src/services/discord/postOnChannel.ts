import { TextChannel, type Client } from "discord.js-selfbot-v13";

export const postOnChannel = (
  client: Client,
  channelId: string,
  file: string,
  filename: string,
) => {
  const channel = client.channels.cache.get(channelId);
  if (!channel) throw new Error("Channel not found");
  if (!(channel instanceof TextChannel))
    throw new Error("Channel is not a text channel");
  return channel.send({ files: [{ attachment: file, name: filename }] });
};
