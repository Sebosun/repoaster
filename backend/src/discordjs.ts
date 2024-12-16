import { Client } from "discord.js-selfbot-v13";
import dotenv from "dotenv";
import { parseMessage } from '@/controllers/discordjs/parseMessage'

dotenv.config();

const client = new Client({ checkUpdate: false });

const token = process.env.TOKEN;
const testGuild = process.env.TEST_GUILD;

if (!token) throw new Error("No token");
if (!testGuild) throw new Error("No test guild");

client.login(token);

client.on("ready", async () => {
  console.log("Bot is ready");
});

client.on('messageCreate', (message) =>
  parseMessage(message, client)
)
export default client;
