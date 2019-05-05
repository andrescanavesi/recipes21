const express = require("express");
const router = express.Router();
const daoRecipies = require("../daos/dao_recipies");
const { responseJson, cache } = require("../util/configs");

router.get("/:id/:titleforurl", cache(), async function(req, res, next) {
  try {
    //titleforurl path param is for SEO purposes. It is ignored by the code
    const recipeId = req.params.id;
    const recipe = await daoRecipies.findById(recipeId);

    responseJson.title = recipe.title;
    responseJson.recipe = recipe;
    responseJson.createdAt = recipe.created_at;
    responseJson.updatedAt = recipe.updated_at;
    responseJson.linkToThisPage = recipe.url;
    responseJson.description = recipe.description + " | recipes21.com";
    responseJson.metaImage = recipe.featured_image;
    responseJson.keywords = recipe.keywords_csv;

    res.render("recipe", responseJson);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
