const log4js = require("log4js");

/**
 * Use it as:
 *
 * const {logger} = require("./util/logger");
 * const log = new logger("my_module");
 * log.info('hello');
 */
module.exports.logger = function(moduleName) {
    const logger = log4js.getLogger(moduleName);
    logger.level = process.env.R21_LOG_LEVEL || "info";
    return logger;
};
