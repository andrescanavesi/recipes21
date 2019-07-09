/**
 * Endpoint to expose some cache operations such as display status and clear cache
 * It uses apicache module: https://www.npmjs.com/package/apicache
 */

const express = require("express");
const router = express.Router();

const {apicache} = require("../util/configs");

/**
 * Displays cache info
 */
router.get("/", (req, res) => {
    res.json(apicache.getIndex());
});

/**
 * Clears all cache
 */
router.get("/clear", (req, res) => {
    res.json(apicache.clear());
});

module.exports = router;
