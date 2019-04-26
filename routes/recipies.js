const express = require("express");
const router = express.Router();
const daoRecipies = require("../daos/dao_recipies");

////////////////////////////////////////// cache //////////////////////////////////////////////////
const apicache = require("apicache");
const cacheOptions = {
  debug: true,
  defaultDuration: "5 minutes",
  enabled: true
};
apicache.options(cacheOptions);
const cache = apicache.middleware;
/////////////////////////////////////////////////////////////////////////////////////////////////

router.get("/", cache(), function(req, res, next) {
  const page = getPage(req);
  const recipies = daoRecipies.find(page);
  response(recipies, page, res);
});

router.get("/search", cache(), function(req, res, next) {
  const phrase = req.query.phrase;
  const page = getPage(req);
  const recipies = daoRecipies.find(rpage);
  response(recipies, page, res);
});

/**
 *
 */
router.get("/by-keyword", cache(), function(req, res, next) {
  const keyword = req.query.keyword;
  const page = getPage(req);
  const recipies = daoRecipies.find(page);
  response(recipies, page, res);
});

/**
 *
 * @param {list of reciies as json} recipies
 * @param {integer} page
 * @param {http response} res
 */
function response(recipies, page, res) {
  const jsonResponse = {};
  jsonResponse.status = "ok";
  jsonResponse.page = page;
  jsonResponse.page_size = 10;
  jsonResponse.recipies = recipies;

  res.status(200);
  res.json(jsonResponse);
}

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
