import { TextChannel, type Client } from "discord.js-selfbot-v13";
import { z } from "zod";
import { isTwitterLink, parseTwitterLink } from "@/helpers/parseTwitterLink";

async function postMediaOnChannel(
  client: Client,
  channelId: string,
  file: string,
  filename: string,
  message?: string,
) {
  let channel = client.channels.cache.get(channelId);
  if (!channel) {
    const fetched = await client.channels.fetch(channelId);
    if (fetched) channel = fetched;
  }

  if (!channel) {
    throw new Error(`Channel ${channelId} not found`);
  }

  if (!(channel instanceof TextChannel)) {
    throw new Error("Channel is not a text channel");
  }

  return channel.send({
    files: [{ attachment: file, name: filename }],
    content: message,
  });
}

async function postMessageOnChannel(
  client: Client,
  channelId: string,
  message: string,
) {
  let channel = client.channels.cache.get(channelId);
  if (!channel) {
    const fetched = await client.channels.fetch(channelId);
    if (fetched) channel = fetched;
  }
  if (!channel) throw new Error(`Channel ${channelId} not found`);
  if (!(channel instanceof TextChannel))
    throw new Error("Channel is not a text channel");
  const urlSchema = z.string().url();
  const msgArr = message.split(" ");

  const msg = msgArr
    .map((msg) => {
      if (!urlSchema.safeParse(msg).success) return msg;
      if (!isTwitterLink(msg)) return msg;
      return parseTwitterLink(msg);
    })
    .join(" ");

  return channel.send(msg);
}

export { postMediaOnChannel, postMessageOnChannel };
