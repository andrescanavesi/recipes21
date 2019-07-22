const express = require("express");
const router = express.Router();
const daoRecipies = require("../daos/dao_recipies");
const {cache} = require("../util/configs");
const responseHelper = require("../util/response_helper");
const dbHelper = require("../daos/db_helper");

router.get("/sync", async function(req, res, next) {
    try {
        console.info(req.query.adminSecret);
        console.info(process.env.R21_ADMIN_SECRET);
        if (req.query.adminSecret === process.env.R21_ADMIN_SECRET) {
            console.info("db sync....");
            dbHelper.dbSync().then(() => {
                console.info("DB synced");
                res.json({status: "ok!"});
            });
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

        const p1 = dbHelper.Recipe.findAll();
        const p2 = dbHelper.Recipe.findAll();
        const p3 = dbHelper.Recipe.findAll();

        //const p2 = daoRecipies.findAll(page);
        //const p3 = daoRecipies.findRecipesSpotlight();
        const [recipes, footerRecipes, recipesSpotlight] = await Promise.all([p1, p2, p3]);

        if (!recipes) {
            throw Error("No recipes found");
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
        if (dbHelper.searchIndex.length === 0) {
            throw new Error("index to search not ready");
        }
        const phrase = req.query.q;
        if (!phrase) {
            throw Error("phrase query parameter empty");
        }
        console.info("searching by: " + phrase);

        //search using flexsearch. It will return a list of IDs we used as keys during indexing
        const resultIds = await dbHelper.searchIndex.search({
            query: phrase,
            suggest: true, //When suggestion is enabled all results will be filled up (until limit, default 1000) with similar matches ordered by relevance.
        });

        console.info("results: " + resultIds.length);
        let p1;
        if (resultIds.length === 0) {
            p1 = daoRecipies.findRecipesSpotlight();
        } else {
            p1 = daoRecipies.findByIds(resultIds);
        }

        const p2 = daoRecipies.findRecipesSpotlight();
        const p3 = daoRecipies.findAll();

        const [recipes, recipesSpotlight, footerRecipes] = await Promise.all([p1, p2, p3]);
        console.info("Recipes: ");
        console.info(recipes);
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
        console.info("recipes by keyword: " + req.params.keyword);
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
