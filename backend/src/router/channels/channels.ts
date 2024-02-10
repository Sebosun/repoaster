import { getAllGuilds } from "@/services/discord/getGuildsChannel";
import express from "express";
import client from "@/discordjs";
import { getChannels } from "@/services/discord/getChannels";
import {
  Guild,
  TextChannel,
  PartialGroupDMChannel,
} from "discord.js-selfbot-v13";

const router = express.Router();

interface GuildWithChannels {
  guild: Guild;
  channelsDetails: Array<TextChannel | PartialGroupDMChannel>;
}

router.get("", async (_, res) => {
  try {
    const guilds = await getAllGuilds(client);
    if (!guilds?.length) {
      res.status(404);
      res.json({ message: "No guilds found" });
      return;
    }

    let guildsWithChannels = [] as GuildWithChannels[];

    for (const guild of guilds) {
      try {
        const channels = await getChannels(
          client,
          guild.channels.cache.map((channel) => channel.id),
        );

        guildsWithChannels.push({ guild, channelsDetails: channels });
      } catch (e) {
        console.error("Something went wrong");
      }
    }

    res.status(200).json(guildsWithChannels);
  } catch (e) {
    res.status(500).json({ message: "GET /channels" });
  }
});

export default router;
