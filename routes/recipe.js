const express = require("express");
const router = express.Router();
const daoRecipies = require("../daos/dao_recipies");
const { responseJson, cache } = require("../util/configs");

router.get("/:id/:titleforurl", async function(req, res, next) {
  try {
    //titleforurl path param is for SEO purposes. It is ignored by the code
    const recipeId = req.params.id;
    const recipe = await daoRecipies.findById(recipeId);
    const recipesSpotlight = await daoRecipies.findRecipesSpotlight();

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
    console.log("recipes spotlight");
    console.info(responseJson.recipesSpotlight);

    res.render("recipe", responseJson);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
