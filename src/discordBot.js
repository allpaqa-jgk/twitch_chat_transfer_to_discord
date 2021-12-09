const { logger } = require("./logger");
// ログイン処理
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
module.exports.client = client;
const config = require("config");

const token = config.DISCORD_TOKEN;


logger.mark("* discord bot is starting...");
  
client.on("message", onMessageHandler);
client.on("ready", onConnectedHandler);

if (token) {
  client.login(token).catch((e) => {
    logger.error(e);
  });
} else {
  logger.warn("DISCORD_TOKEN is not found. please set it at config file");
}

// Bot自身の発言を無視する呪い
function onMessageHandler(message) {
  // eslint-disable-next-line no-empty
  if (message.author.bot) {
  }
  // ↓ここに後述のコードをコピペする↓
  logger.mark(message)
  // ↑ここに後述のコードをコピペする↑
}

function onConnectedHandler() {
  logger.mark("* discord bot is ready...");
}
