import { Client } from "discord.js-selfbot-v13";
import dotenv from "dotenv";
import { parseSelfCommand } from '@/controllers/discordjs/parseSelfCommand'
import { channelRepoast } from '@/controllers/discordjs/channelRepoast'

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

const chId = '1354834396879913041'

client.on('messageCreate', (message) => {
    if (chId === message.channelId) {
        channelRepoast(message, client)
    }
    parseSelfCommand(message, client)
})

export default client;
