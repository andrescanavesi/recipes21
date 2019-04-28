var express = require("express");
var router = express.Router();
const daoRecipies = require("../daos/dao_recipies");

////////////////////////////////////////// cache //////////////////////////////////////////////////
const apicache = require("apicache");
const cacheOptions = {
  debug: false,
  defaultDuration: "5 minutes",
  enabled: false
};
apicache.options(cacheOptions);
const cache = apicache.middleware;
/////////////////////////////////////////////////////////////////////////////////////////////////

/* GET home page. */
router.get("/", function(req, res, next) {
  const page = getPage(req);
  const recipies = daoRecipies.find(page);

  if (!recipies) {
    throw Error("No recipies found");
  }

  const json = {};
  json.title = "recetas-city.com";
  json.recipies = recipies;
  console.log(json);
  res.render("index", json);
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
