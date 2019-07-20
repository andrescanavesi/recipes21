const express = require("express");
const router = express.Router();
const daoRecipies = require("../daos/dao_recipies");
const {cache} = require("../util/configs");
const responseHelper = require("../util/response_helper");

router.get("/:id/:titleforurl", async function(req, res, next) {
    try {
        let responseJson = responseHelper.getResponseJson(req);

        //titleforurl path param is for SEO purposes. It is ignored by the code
        const recipeId = req.params.id;
        const recipe = await daoRecipies.findById(recipeId);
        const recipesSpotlight = await daoRecipies.findRecipesSpotlight();
        const footerRecipes = await daoRecipies.findAll();

        responseJson.title = recipe.title;
        responseJson.recipe = recipe;
        responseJson.createdAt = recipe.created_at;
        responseJson.updatedAt = recipe.updated_at;
        responseJson.linkToThisPage = recipe.url;
        responseJson.description = recipe.description + " | recipes21.com";
        responseJson.metaImage = recipe.featured_image;
        responseJson.keywords = recipe.keywords_csv;
        responseJson.recipesSpotlight = recipesSpotlight;
        responseJson.isHomePage = false;
        responseJson.footerRecipes = footerRecipes;

        res.render("recipe", responseJson);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
