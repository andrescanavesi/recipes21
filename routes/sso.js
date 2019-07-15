const express = require("express");
const router = express.Router();
const {responseJson} = require("../util/configs");
const googleUtil = require("../util/google-util");

router.get("/", async function(req, res, next) {
    try {
        const urlGoogle = googleUtil.urlGoogle();
        responseJson.urlGoogle = urlGoogle;
        res.render("sso", responseJson);
    } catch (e) {
        next(e);
    }
});

router.get("/google/callback", async function(req, res, next) {
    try {
        const result = await googleUtil.getGoogleAccountFromCode(req.query.code);
        console.info(result.id);
        console.info(result.email);
        const urlGoogle = googleUtil.urlGoogle();
        responseJson.urlGoogle = urlGoogle;
        responseJson.recipesSpotlight = [];
        responseJson.footerRecipes = [];
        res.render("sso", responseJson);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
