const express = require("express");
const router = express.Router();
const daoRecipies = require("../daos/dao_recipies");

router.get("/", cache(), function(req, res, next) {
  try {
  } catch (e) {
    next(e);
  }
});

module.exports = router;
