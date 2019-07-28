const {logger} = require("../util/logger");
const log = new logger("route_index");

const express = require("express");
const router = express.Router();
const daoRecipies = require("../daos/dao_recipies");
const daoUsers = require("../daos/dao_users");
const {cache} = require("../util/configs");
const responseHelper = require("../util/response_helper");
const dbHelper = require("../daos/db_helper");
const utils = require("../util/utils");

router.get("/seed", async function(req, res, next) {
    try {
        if (req.query.adminSecret === process.env.R21_ADMIN_SECRET) {
            log.info("db seed....");
            await daoUsers.seed();
            await daoRecipies.seed(1);
            res.json({status: "ok"});
        } else {
            res.status(400);
            res.json({status: "error"});
        }
    } catch (e) {
        next(e);
    }
});

router.get("/reset-cache", async function(req, res, next) {
    try {
        if (req.query.adminSecret === process.env.R21_ADMIN_SECRET) {
            log.info("Reset cache....");
            await daoRecipies.resetCache();
            res.json({status: "ok"});
        } else {
            res.status(400);
            res.json({status: "error"});
        }
    } catch (e) {
        next(e);
    }
});

/**
 * Home page
 */
router.get("/", async function(req, res, next) {
    try {
        let responseJson = responseHelper.getResponseJson(req);
        responseJson.displayMoreRecipes = true;
        const page = getPage(req);

        const p1 = daoRecipies.findAll(page);
        const p2 = daoRecipies.findAll(page);
        const p3 = daoRecipies.findAll(page);

        //const p2 = daoRecipies.findAll(page);
        //const p3 = daoRecipies.findRecipesSpotlight();
        const [recipes, footerRecipes, recipesSpotlight] = await Promise.all([p1, p2, p3]);

        if (!recipes) {
            throw Error("No recipes found");
        }
        for (let i = 0; i < recipes.length; i++) {
            recipes[i].im_owner = utils.imRecipeOwner(req, recipes[i]);
            recipes[i].allow_edition = utils.allowEdition(req, recipes[i]);
        }

        responseJson.recipes = recipes;
        responseJson.isHomePage = true;
        responseJson.footerRecipes = footerRecipes;
        responseJson.recipesSpotlight = recipesSpotlight;
        responseJson.searchText = "";
        res.render("index", responseJson);
    } catch (e) {
        next(e);
    }
});

router.get("/search", async function(req, res, next) {
    try {
        let responseJson = responseHelper.getResponseJson(req);
        responseJson.displayMoreRecipes = true;

        const phrase = req.query.q;
        if (!phrase) {
            throw Error("phrase query parameter empty");
        }
        log.info("searching by: " + phrase);

        if (daoRecipies.searchIndex.length === 0) {
            await daoRecipies.buildSearchIndex();
        }

        //search using flexsearch. It will return a list of IDs we used as keys during indexing
        const resultIds = await daoRecipies.searchIndex.search({
            query: phrase,
            suggest: true, //When suggestion is enabled all results will be filled up (until limit, default 1000) with similar matches ordered by relevance.
        });

        log.info("results: " + resultIds.length);
        let p1;
        if (resultIds.length === 0) {
            p1 = daoRecipies.findRecipesSpotlight();
        } else {
            p1 = daoRecipies.findByIds(resultIds);
        }

        const p2 = daoRecipies.findRecipesSpotlight();
        const p3 = daoRecipies.findAll();

        const [recipes, recipesSpotlight, footerRecipes] = await Promise.all([p1, p2, p3]);
        if (recipes.length === 0) {
            recipes = recipesSpotlight;
        }
        responseJson.recipes = recipes;
        responseJson.isHomePage = false;
        responseJson.recipesSpotlight = recipesSpotlight;
        responseJson.footerRecipes = footerRecipes;
        responseJson.searchText = phrase;

        res.render("index", responseJson);
    } catch (e) {
        next(e);
    }
});

router.get("/recipes/keyword/:keyword", async function(req, res, next) {
    try {
        let responseJson = responseHelper.getResponseJson(req);
        responseJson.displayMoreRecipes = true;
        log.info("recipes by keyword: " + req.params.keyword);
        const recipes = await daoRecipies.findWithKeyword(req.params.keyword);
        const recipesSpotlight = await daoRecipies.findRecipesSpotlight();
        const footerRecipes = await daoRecipies.findAll();

        if (!recipes) {
            throw Error("No recipes found");
        }

        responseJson.recipes = recipes;
        responseJson.title = "Recipes of " + req.params.keyword + " | Recipes21";
        responseJson.description = "The best recipes of " + req.params.keyword + " | Recipes21";
        responseJson.linkToThisPage = process.env.R21_BASE_URL + "recipes/keyword/" + req.params.keyword;
        responseJson.isHomePage = false;
        responseJson.recipesSpotlight = recipesSpotlight;
        responseJson.footerRecipes = footerRecipes;

        res.render("index", responseJson);
    } catch (e) {
        next(e);
    }
});

router.get("/terms-and-conditions", async function(req, res, next) {
    let responseJson = responseHelper.getResponseJson(req);
    res.render("terms-and-conditions", responseJson);
});

router.get("/privacy-policy", async function(req, res, next) {
    let responseJson = responseHelper.getResponseJson(req);
    res.render("privacy-policy", responseJson);
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
