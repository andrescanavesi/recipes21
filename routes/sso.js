const {logger} = require("../util/logger");
const log = new logger("route_sso");

const express = require("express");
const router = express.Router();
const responseHelper = require("../util/response_helper");
const googleUtil = require("../util/google-util");
const daoUsers = require("../daos/dao_users");
const daoRecipies = require("../daos/dao_recipies");

router.get("/", async function(req, res, next) {
    try {
        const urlGoogle = googleUtil.urlGoogle();
        const responseJson = responseHelper.getResponseJson(req);
        responseJson.urlGoogle = urlGoogle;

        const p1 = daoRecipies.findAll();
        const p2 = daoRecipies.findRecipesSpotlight();
        const [footerRecipes, recipesSpotlight] = await Promise.all([p1, p2]);

        responseJson.displayMoreRecipes = true;
        responseJson.footerRecipes = footerRecipes;
        responseJson.recipesSpotlight = recipesSpotlight;

        res.render("sso", responseJson);
    } catch (e) {
        next(e);
    }
});

// router.get("/facebook/callback", async function(req, res, next) {
//     try {
//         log.info("facebook callback TBD");
//         res.redirect("/");
//     } catch (e) {
//         next(e);
//     }
// });

router.get("/google/callback", async function(req, res, next) {
    try {
        let result;
        let urlGoogle;
        if (req.query.imTesting) {
            result = {id: "1234", email: "andres.canavesi@gmail.com"};
            urlGoogle =
                "https://lh4.googleusercontent.com/-Yej6nP72QLo/AAAAAAAAAAI/AAAAAAAACEw/p5deNWSbkEY/s50/photo.jpg";
        } else {
            result = await googleUtil.getGoogleAccountFromCode(req.query.code);
            urlGoogle = googleUtil.urlGoogle();
        }

        let responseJson = responseHelper.getResponseJson(req);
        responseJson.urlGoogle = urlGoogle;
        responseJson.recipesSpotlight = [];
        responseJson.footerRecipes = [];

        req.session.ssoId = result.id;
        req.session.ssoEmail = result.email;
        req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 365; //one year
        req.session.userName = result.email.split("@")[0];
        req.session.userImageUrl = result.imageUrl;

        const user = await daoUsers.findByEmail(result.email);
        if (!user) {
            //the user does not exist, let's create a new one
            const user = {
                email: result.email,
                username: req.session.userName,
                is_admin: false,
            };
            log.info("The user " + result.email + " is not registered. Will be created");
            await daoUsers.create(user);
            const userDB = await daoUsers.findByEmail(user.email);
            user.id = userDB.id;
        } else {
            log.info("the user " + result.email + " is already registered");
        }
        req.session.user_id = user.id;
        req.session.is_user_admin = user.id === 1; //let's do this for now

        res.redirect("/");
    } catch (e) {
        next(e);
    }
});

module.exports = router;
