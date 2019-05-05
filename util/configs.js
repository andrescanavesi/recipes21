const moment = require("moment");

//parent response.
const responseJson = {};
responseJson.title = "recipes21.com";
responseJson.today = moment().format("YYYY/MM/DD");
responseJson.isProduction = process.env.IS_PRODUCTION || false;

////////////////////////////////////////// cache //////////////////////////////////////////////////
const cacheEnabled = process.env.RC_CACHE_ENABLED || false;
const cacheDebug = process.env.RC_CACHE_DEBUG || false;
const apicache = require("apicache");
const cacheOptions = {};
cacheOptions.debug = JSON.parse(cacheEnabled);
cacheOptions.enabled = JSON.parse(cacheDebug);
cacheOptions.defaultDuration = "1 hour";
console.info("cache options: ");
console.info(cacheOptions);
apicache.options(cacheOptions);
/////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.responseJson = responseJson;
module.exports.cache = apicache.middleware;
