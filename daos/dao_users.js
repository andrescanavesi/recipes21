const dbHelper = require("./db_helper");
const moment = require("moment");
const sqlFormatter = require("sql-formatter");

module.exports.create = async function(user) {
    console.info("Creating user");
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const query =
        "INSERT INTO users(email, is_admin, username, first_name, last_name,created_at, updated_at) " +
        "VALUES($1,$2,$3,$4,$5,$6,$7)";
    const bindings = [user.email, user.is_admin, user.username, user.first_name, user.last_name, today, today];
    const result = await dbHelper.execute.query(query, bindings);
    //console.info(result);
    return result.insertId;
};

module.exports.seed = async function() {
    const user = {
        email: "andres.canavesi@gmail.com",
        is_admin: true,
        username: "andres.canavesi",
        first_name: "Andres",
        last_name: "Canavesi",
    };
    await this.create(user);
};
module.exports.findByEmail = async function(email) {};
