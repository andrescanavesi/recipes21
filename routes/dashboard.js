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

/**
 *
 */
// router.get("/recipe/edit/:recipeId", async function(req, res, next) {
//     try {
//         const recipe = await daoRecipies.findById(req.params.recipeId);
//         responseJson.recipe = recipe;
//         responseJson.successMessage = null;
//         res.render("recipe-edit", responseJson);
//     } catch (e) {
//         next(e);
//     }
// });

module.exports = router;
