const { logger } = require("./logger");
// ログイン処理
const { Client, Intents } = require('discord.js');
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ]
});
module.exports.client = client;
const config = require("config");

const token = config.DISCORD_TOKEN;


logger.mark("* discord bot is starting...");
  
client.on("ready", onConnectedHandler);

if (token) {
  client.login(token).catch((e) => {
    logger.error(e);
  });
} else {
  logger.warn("DISCORD_TOKEN is not found. please set it at config file");
}

function onConnectedHandler() {
  logger.mark("* discord bot is ready...");
}
