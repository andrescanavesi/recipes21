const express = require("express");
const router = express.Router();
const daoRecipies = require("../daos/dao_recipies");
const { responseJson } = require("../util/configs");

/**
 *
 */
router.get("/", async function(req, res, next) {
  try {
    const recipes = await daoRecipies.find(2);
    responseJson.recipes = recipes;
    res.render("dashboard", responseJson);
  } catch (e) {
    next(e);
  }
});

router.post("/", async function(req, res, next) {
  try {
    //TODO sanitize with express validator
    if (req.body) {
      const title = req.body["title-170"];
      console.info("Recipe title submited: " + title);
    }
    responseJson.successMessage = "ok";
    //const recipes = await daoRecipies.find(2);
    //responseJson.recipes = recipes;
    res.render("dashboard", responseJson);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
