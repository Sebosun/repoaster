import { TextChannel, type Client } from "discord.js-selfbot-v13";
import { z } from "zod";
import { isTwitterLink, parseTwitterLink } from "@/helpers/parseTwitterLink";

function postMediaOnChannel(
  client: Client,
  channelId: string,
  file: string,
  filename: string,
) {
  const channel = client.channels.cache.get(channelId);
  if (!channel) throw new Error("Channel not found");
  if (!(channel instanceof TextChannel))
    throw new Error("Channel is not a text channel");
  return channel.send({ files: [{ attachment: file, name: filename }] });
}

function postMessageOnChannel(
  client: Client,
  channelId: string,
  message: string,
) {
  const channel = client.channels.cache.get(channelId);
  if (!channel) throw new Error("Channel not found");
  if (!(channel instanceof TextChannel))
    throw new Error("Channel is not a text channel");
  const urlSchema = z.string().url();
  const msgArr = message.split(" ");

  const newMsg = msgArr
    .map((msg) => {
      if (!urlSchema.safeParse(msg).success) return msg;
      if (!isTwitterLink(msg)) return msg;
      return parseTwitterLink(msg);
    })
    .join(" ");

  return channel.send(newMsg);
}

export { postMediaOnChannel, postMessageOnChannel };
