const { logger } = require("./logger");
const tmi = require("tmi.js");
const config = require("config");
const discordBotClient = require("./discordBot").client;
logger.debug("config", config);
let client;

logger.info("* tmi is starting...");

function botUsername() {
  return config.BOT_USERNAME || config.TW_CHANNEL_NAME + "_bot";
}
// Define configuration options
let opts;
if (config.TW_OAUTH_TOKEN && config.TW_CHANNEL_NAME) {
  opts = {
    identity: {
      username: botUsername(),
      password: config.TW_OAUTH_TOKEN,
    },
    channels: [config.TW_CHANNEL_NAME],
  };

  // Create a client with our options
  // eslint-disable-next-line new-cap
  client = new tmi.client(opts);

  // Register our event handlers (defined below)
  client.on("message", onMessageHandler);
  client.on("connected", onConnectedHandler);
  client.on("disconnected", onDisconnectedHandler);

  // Connect to Twitch:
  client.connect().catch((e) => {
    logger.error(e);
  });
}

function sendToDiscord(msg) {
  if (!msg) {
    // send to discord
    logger.debug("active message");
    return;
  }
  discordBotClient.channels
    .fetch(config.DISCORD_CHANNEL_ID)
    .then((channel) => {
      logger.debug("channel", channel.name);
      if (channel) {
        logger.debug("msg", msg);

        return channel.send(msg).catch((e) => {
          logger.error(e);
        });
      }
    })
    .catch(logger.error);
}

function mergeUserDisplayName(context) {
  const username = context.username;
  const displayname = context["display-name"];
  if (username === displayname) {
    return username;
  } else {
    return `${displayname}(${username})`;
  }
}

function escapeMassMension(msg) {
  return msg
    .replace(/^[!?！？`]+/, "")
    .replace(/`/g, "¥`")
    .replace(/@/g, "`@`");
}

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  if (self) {
    return;
  } // Ignore messages from the bot

  // DEBUG
  // logger.debug("target", target);
  // logger.debug("context", context);

  // Remove whitespace from chat message
  const name = mergeUserDisplayName(context);
  logger.info(`Message from Discord: [${name}] ${msg}`);
  const discordSegment = "`" + name + "`: " + escapeMassMension(msg);

  sendToDiscord(discordSegment);
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  logger.info(`* tmi is connected to ${addr}:${port}...`);
}

// onDisconnectedHandler(reason: string)
function onDisconnectedHandler(reason) {
  logger.info(`* tmi is disconnected to ${reason}...`);
  setTimeout(() => {
    if (typeof client.reconnect === "function")
      client.reconnect().catch((e) => {
        logger.error(e);
      });
  }, 5000);
}

// discord
discordBotClient.on("messageCreate", onMessageCreateHandler);
function onMessageCreateHandler(message) {
  // ignore self comment
  if (!message.author.bot && !message.author.system) {
    if (message.channelId === config.DISCORD_CHANNEL_ID) {
      logger.info(
        `Message from Discord: [${message.author.username}] ${message.content}`
      );
      const username = message.author.username;
      const content = message.content;
      client.say(
        config.TW_CHANNEL_NAME,
        `from discord [${username}] ${content}`
      );
    }
  }
}
