import { TextChannel, type Client } from "discord.js-selfbot-v13";

const postMediaOnChannel = (
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

const postMessageOnChannel = (
  client: Client,
  channelId: string,
  message: string,
) => {
  const channel = client.channels.cache.get(channelId);
  if (!channel) throw new Error("Channel not found");
  if (!(channel instanceof TextChannel))
    throw new Error("Channel is not a text channel");

  return channel.send(message);
};

export { postMediaOnChannel, postMessageOnChannel };
