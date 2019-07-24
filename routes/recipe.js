const express = require("express");
const router = express.Router();
const daoRecipies = require("../daos/dao_recipies");
const {cache} = require("../util/configs");
const responseHelper = require("../util/response_helper");

router.get("/:id/:titleforurl", async function(req, res, next) {
    try {
        let responseJson = responseHelper.getResponseJson(req);
        responseJson.displayMoreRecipes = true;

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

router.get("/new", async function(req, res, next) {
    try {
        let responseJson = responseHelper.getResponseJson(req);
        if (process.env.R21_IS_PRODUCTION === true && !responseJson.isUserAuthenticated) {
            res.redirect("/sso");
        } else {
            responseJson.recipe = {
                id: 0,
                title: "",
            };
            responseJson.newRecipe = true;
            responseJson.successMessage = null;
            res.render("recipe-edit", responseJson);
        }
    } catch (e) {
        next(e);
    }
});

router.post("/edit/:recipeId", async function(req, res, next) {
    try {
        let responseJson = responseHelper.getResponseJson(req);
        if (process.env.R21_IS_PRODUCTION === true && !responseJson.isUserAuthenticated) {
            res.redirect("/sso");
        } else {
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
                title_for_url: titleForUrl,
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
        }
    } catch (e) {
        next(e);
    }
});

module.exports = router;
