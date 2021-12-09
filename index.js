const { logger } = require("./src/logger");
logger.info(`logger initialized level: ${logger.level}`)

const forever = require("forever-monitor");
const path = require("path");
// require(path.join(__dirname, "./src/logger.js"));

// init process.env
process.env.NODE_CONFIG_DIR = path.join(__dirname, "./config");

logger.mark("//////////////////////");
logger.mark("//  Ctrl-C to exit  //");
logger.mark("//////////////////////");

const child = new forever.Monitor(path.join(__dirname, "./src/twitchBot.js"), {
  //
  // Options for restarting on watched files.
  //
  watch: process.env.NODE_ENV === "development", // Value indicating if we should watch files.
  watchDirectory: "src", // Top-level directory to watch from.
});

if (process.env.NODE_ENV === "development") {
  logger.info("//////////////////////");
  logger.info("//    DEV mode!     //");
  logger.info("//////////////////////");
  // init child process of something.js
  // define events
  child.on("watch:restart", function(info) {
    logger.error("Restaring script because " + info.file + " changed");
  });
}
child.on("restart", function() {
  logger.error("Forever restarting script for " + child.times + " time");
});
child.on("exit:code", function(code) {
  logger.error("Forever detected script exited with code " + code);
});

// start process
child.start();
