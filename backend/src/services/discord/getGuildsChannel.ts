import type { Client } from "discord.js-selfbot-v13";

export const getGuildsChannel = async (client: Client, guildId: string) => {
  try {
    const guild = await client.guilds.fetch(guildId);
    const channels = await guild.channels.fetch();
    const channelsFiltered = channels.filter(
      (channel) => channel?.type === "GUILD_TEXT",
    );
    return channelsFiltered;
  } catch (e) {
    console.error("Something went wrong", e);
  }
};

export const getAllGuilds = async (client: Client) => {
  try {
    const guilds = client.guilds.cache.map((guild) => guild);
    return guilds;
  } catch (e) {
    console.error("Something went wrong", e);
  }
};
