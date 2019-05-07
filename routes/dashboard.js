const express = require("express");
const router = express.Router();
const daoRecipies = require("../daos/dao_recipies");
const { responseJson } = require("../util/configs");

/**
 *
 */
router.get("/recipe/edit/:recipeId", async function(req, res, next) {
  try {
    const recipe = await daoRecipies.findById(req.params.recipeId);
    responseJson.recipe = recipe;
    responseJson.successMessage = null;
    res.render("dashboard", responseJson);
  } catch (e) {
    next(e);
  }
});

router.post("/recipe/edit/:recipeId", async function(req, res, next) {
  try {
    //TODO sanitize with express validator
    const recipeId = req.params.recipeId;
    const title = req.body["title"];
    const ingredients = req.body["ingredients"];
    const steps = req.body["steps"];
    console.info("Recipe title submited: " + recipeId + " " + title);
    const recipeToUdate = {
      id: recipeId,
      title: title,
      ingredients: ingredients,
      steps: steps
    };
    console.info(recipeToUdate);
    //await daoRecipies.update(recipeToUdate);
    const recipe = await daoRecipies.findById(recipeId);
    responseJson.successMessage = "ok";
    responseJson.recipe = recipe;
    res.render("dashboard", responseJson);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
