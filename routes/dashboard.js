const express = require("express");
const router = express.Router();
const daoRecipies = require("../daos/dao_recipies");
const {responseJson} = require("../util/configs");

router.get("/", async function(req, res, next) {
    try {
        const recipes = await daoRecipies.findAll();
        responseJson.recipes = recipes;
        responseJson.successMessage = null;
        res.render("dashboard", responseJson);
    } catch (e) {
        next(e);
    }
});

router.get("/recipe/new", async function(req, res, next) {
    try {
        responseJson.recipe = {
            id: 0,
            title: "new",
        };
        responseJson.successMessage = null;
        res.render("recipe-edit", responseJson);
    } catch (e) {
        next(e);
    }
});

/**
 *
 */
router.get("/recipe/edit/:recipeId", async function(req, res, next) {
    try {
        const recipe = await daoRecipies.findById(req.params.recipeId);
        responseJson.recipe = recipe;
        responseJson.successMessage = null;
        res.render("recipe-edit", responseJson);
    } catch (e) {
        next(e);
    }
});

router.post("/recipe/edit/:recipeId", async function(req, res, next) {
    try {
        //TODO sanitize with express validator
        const recipeId = req.params.recipeId;
        console.info("Recipe id: " + recipeId);
        const title = req.body.title;
        const titleForUrl = req.body.title_for_url;
        const ingredients = req.body.ingredients;
        const steps = req.body.steps;
        console.info("Recipe title submited: " + recipeId + " " + title);
        const recipeToUdate = {
            id: recipeId,
            title: title,
            titleForUrl: titleForUrl,
            ingredients: ingredients,
            steps: steps,
        };
        console.info(recipeToUdate);
        if (recipeId === "0") {
            recipeId = await daoRecipies.create(recipeToUdate);
        } else {
            await daoRecipies.update(recipeToUdate);
        }

        const recipe = await daoRecipies.findById(recipeId);
        responseJson.successMessage = "ok";
        responseJson.recipe = recipe;
        res.render("recipe-edit", responseJson);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
