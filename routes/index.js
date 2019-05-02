var express = require("express");
var router = express.Router();
const daoRecipies = require("../daos/dao_recipies");

////////////////////////////////////////// cache //////////////////////////////////////////////////
const apicache = require("apicache");
const cacheOptions = {};
cacheOptions.debug = JSON.parse(process.env.RC_CACHE_DEBUG);
cacheOptions.enabled = JSON.parse(process.env.RC_CACHE_ENABLED);
cacheOptions.defaultDuration = "1 hour";
console.info(cacheOptions);
apicache.options(cacheOptions);
const cache = apicache.middleware;
/////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Home page
 */
router.get("/", cache(), async function(req, res, next) {
  try {
    const page = getPage(req);
    const recipes = await daoRecipies.find(page);

    if (!recipes) {
      throw Error("No recipies found");
    }

    const json = {};
    json.title = "recetas-city.com";
    json.recipies = recipes;
    res.render("index", json);
  } catch (e) {
    next(e);
  }
});

router.get("/recipes/keyword/:keyword", cache(), async function(
  req,
  res,
  next
) {
  try {
    const recipes = await daoRecipies.findWithKeyword(req.params.keyword);

    if (!recipes) {
      throw Error("No recipies found");
    }

    const json = {};
    json.title = "Recipes with " + req.params.keyword;
    json.recipies = recipes;
    res.render("index", json);
  } catch (e) {
    next(e);
  }
});

/**
 *
 * @param {http request} req
 */
function getPage(req) {
  let page = 0;
  if (req.query.page) {
    if (isNaN(req.query.page)) {
      throw Error("page is not a number");
    }
    page = parseInt(req.query.page);

    if (req.query.page < 0) {
      throw Error("page must be greater or equals to 0");
    }
  }
  return page;
}

module.exports = router;
