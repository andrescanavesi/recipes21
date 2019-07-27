const moment = require("moment");

module.exports.getResponseJson = function(req) {
    //default attributes for the response response.
    const responseJson = {};
    responseJson.title = "recipes21.com";
    responseJson.today = moment().format("YYYY-MM-DD");
    responseJson.isProduction = JSON.parse(process.env.R21_IS_PRODUCTION) || false;
    responseJson.isHomePage = false;
    responseJson.displayMoreRecipes = false;
    responseJson.createdAt = moment().format("YYYY-MM-DD");
    responseJson.updatedAt = moment().format("YYYY-MM-DD");
    responseJson.linkToThisPage = process.env.BASE_URL;
    responseJson.description = "recipes21.com. The best recipes for cooking";
    responseJson.metaImage = process.env.R21_DEFAULT_IMAGE_URL;
    responseJson.keywords = "recipes,food,cooking";
    responseJson.recipesSpotlight = [];
    responseJson.footerRecipes = [];
    responseJson.searchText = "";

    const metaCache = process.env.R21_META_CACHE || "1"; //in seconds
    responseJson.metaCache = "public, max-age=" + metaCache;

    responseJson.isUserAuthenticated = typeof req.session.ssoId !== "undefined";
    responseJson.userName = req.session.userName;
    responseJson.userImageUrl = req.session.userImageUrl;

    return responseJson;
};
