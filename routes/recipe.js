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
                title: "123",
                featured_image_name: "default.jpg",
                active: false,

                title_for_url: "1234",
                ingredients_raw: "a",
                description: "b",
                steps_raw: "c",
                keywords: "d",
            };
            responseJson.newRecipe = true;
            responseJson.successMessage = null;
            res.render("recipe-edit", responseJson);
        }
    } catch (e) {
        next(e);
    }
});

router.get("/edit", async function(req, res, next) {
    try {
        if (process.env.R21_IS_PRODUCTION === true && !responseJson.isUserAuthenticated) {
            res.redirect("/sso");
        } else {
            let responseJson = responseHelper.getResponseJson(req);
            const recipeId = req.query.id;
            const recipe = await daoRecipies.findById(recipeId, true);
            responseJson.recipe = recipe;
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
            let recipeId = req.params.recipeId;
            console.info("Recipe id: " + req.params.recipeId);
            console.info("Recipe title submited: " + req.params.recipeId + " " + req.body.title);
            const userId = req.session.user_id || 1; //TODO change this
            const recipeToUdate = {
                id: req.params.recipeId,
                title: req.body.title,
                title_for_url: req.body.title_for_url,
                ingredients: req.body.ingredients,
                description: req.body.description,
                steps: req.body.steps,
                keywords: req.body.keywords,
                featured_image_name: req.body.featured_image_name,
                user_id: userId,
            };
            console.info(recipeToUdate);
            if (recipeId === "0") {
                recipeToUdate.active = false;
                recipeId = await daoRecipies.create(recipeToUdate);
            } else {
                await daoRecipies.update(recipeToUdate);
            }

            const url = "/recipe/edit/" + recipeId;
            res.redirect(url);
        }
    } catch (e) {
        next(e);
    }
});

module.exports = router;
