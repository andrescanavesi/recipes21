const moment = require("moment");

//parent response.
const responseJson = {};
responseJson.title = "recipes21.com";
responseJson.today = moment().format("YYYY/MM/DD");
responseJson.isProduction = process.env.IS_PRODUCTION || false;

////////////////////////////////////////// cache //////////////////////////////////////////////////
const apicache = require("apicache");
const cacheOptions = {};
cacheOptions.debug = JSON.parse(process.env.RC_CACHE_DEBUG);
cacheOptions.enabled = JSON.parse(process.env.RC_CACHE_ENABLED);
cacheOptions.defaultDuration = "1 hour";
//console.info(cacheOptions);
apicache.options(cacheOptions);
/////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.responseJson = responseJson;
module.exports.cache = apicache.middleware;
