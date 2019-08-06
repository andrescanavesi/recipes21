const {logger} = require("../util/logger");
const log = new logger("dao_recipes");
const dbHelper = require("./db_helper");
const moment = require("moment");
const sqlFormatter = require("sql-formatter");

module.exports.create = async function(email) {
    log.info("Creating email subscription");
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const query =
        "INSERT INTO email_subscription(email, subscribed, created_at, updated_at) " +
        "VALUES($1,$2,$3,$4) RETURNING id";
    const bindings = [email, true, today, today];

    const result = await dbHelper.execute.query(query, bindings);

    //log.info(result);
    log.info("Email subscription created: " + result.rows[0].id);
    return result.rows[0].id;
};
