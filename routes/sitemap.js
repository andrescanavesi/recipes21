const express = require("express");
const router = express.Router();
const daoRecipies = require("../daos/dao_recipies");
const js2xmlparser = require("js2xmlparser");
const moment = require("moment");
const configs = require("../util/configs");

/**
 * It generates an standard sitemal.xml for SEO purposes
 */
router.get("/", async function(req, res, next) {
    try {
        const baseUrl = process.env.BASE_URL || "http://www.recipes21.com/";
        const recipes = await daoRecipies.findAll();
        const collection = [];
        let today = moment();
        today = today.format("YYYY-MM-DD");
        //add site root url
        const rootUrl = {};
        rootUrl.loc = baseUrl;
        rootUrl.lastmod = today;
        rootUrl.changefreq = "daily";
        rootUrl.priority = "1.0";
        rootUrl["image:image"] = {
            "image:loc": process.env.R21_DEFAULT_IMAGE_URL,
            "image:caption": "recipes21.com. The best recipes for cooking",
        };
        collection.push(rootUrl);

        //add recipes urls
        for (let i = 0; i < recipes.length; i++) {
            const url = {};
            url.loc = recipes[i].url;
            url.lastmod = recipes[i].updated_at;
            url["image:image"] = {
                "image:loc": recipes[i].featured_image_url,
                "image:caption": recipes[i].description,
            };

            collection.push(url);
        }
        const col = {
            "@": {
                xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
                "xmlns:image": "http://www.google.com/schemas/sitemap-image/1.1",
            },
            url: collection,
        };
        const xml = js2xmlparser.parse("urlset", col);
        res.set("Content-Type", "text/xml");
        res.status(200);
        res.send(xml);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
