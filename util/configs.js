const moment = require("moment");

//parent response.
const responseJson = {};
responseJson.title = "recipes21.com";
responseJson.today = moment().format("YYYY-MM-DD");
responseJson.isProduction = JSON.parse(process.env.R21_IS_PRODUCTION) || false;
responseJson.isHomePage = false;
responseJson.createdAt = moment().format("YYYY-MM-DD");
responseJson.updatedAt = moment().format("YYYY-MM-DD");
responseJson.linkToThisPage = process.env.BASE_URL;
responseJson.description = "recipes21.com. The best recipes for cooking";
responseJson.metaImage =
  "https://res.cloudinary.com/dniiru5xy/image/upload/w_600,ar_16:9,c_fill,g_auto,e_sharpen/v1556981218/recipes21/choco-cookies.jpg";
responseJson.keywords = "recipes,food,cooking";
responseJson.recipesSpotlight = [];
responseJson.footerRecipes = [];

const metaCache = process.env.R21_META_CACHE || "1"; //in seconds
responseJson.metaCache = "public, max-age=" + metaCache;

console.info("is production: " + responseJson.isProduction);

////////////////////////////////////////// cache //////////////////////////////////////////////////
const cacheDebug = process.env.R21_CACHE_DEBUG || false;
const cacheEnabled = process.env.R21_CACHE_ENABLED || false;
const apicache = require("apicache");
const cacheOptions = {};
cacheOptions.debug = JSON.parse(cacheDebug);
cacheOptions.enabled = JSON.parse(cacheEnabled);
cacheOptions.defaultDuration = "1 minute";
console.info("cache options: ");
console.info(cacheOptions);
apicache.options(cacheOptions);
/////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.responseJson = responseJson;
module.exports.cache = apicache.middleware;
module.exports.apicache = apicache;
