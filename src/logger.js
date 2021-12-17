const log4js = require("log4js");

// logger
const logger = log4js.getLogger();
// all
// trace
// debug
// info
// warn
// error
// fatal
// mark
// off
if (process.env.NODE_ENV === "development") {
  logger.level = "all";
} else {
  logger.level = "info";
}

module.exports.logger = logger;
