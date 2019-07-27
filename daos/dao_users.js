const {logger} = require("../util/logger");
const log = new logger("dao_users");

const dbHelper = require("./db_helper");
const moment = require("moment");
const sqlFormatter = require("sql-formatter");

module.exports.create = async function(user) {
    log.info("Creating user");
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const query =
        "INSERT INTO users(email, is_admin, username, first_name, last_name,created_at, updated_at) " +
        "VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id";
    const bindings = [user.email, user.is_admin, user.username, user.first_name, user.last_name, today, today];
    const result = await dbHelper.execute.query(query, bindings);
    //console.info(result);
    return result.insertId;
};

module.exports.seed = async function() {
    const user1 = await this.findByEmail("andres.canavesi@gmail.com");
    if (!user1) {
        const user = {
            email: "andres.canavesi@gmail.com",
            is_admin: true,
            username: "andres.canavesi",
            first_name: "Andres",
            last_name: "Canavesi",
        };
        await this.create(user);
    }
};
module.exports.findByEmail = async function(email) {
    if (!email) {
        throw Error("email param not defined");
    }

    const query = "SELECT * FROM users WHERE email = $1 LIMIT 1";
    const bindings = [email];
    //console.info(sqlFormatter.format(query));
    log.info("bindings: " + bindings);
    const result = await dbHelper.execute.query(query, bindings);
    if (result.rows.length > 0) {
        return convertUser(result.rows[0]);
    } else {
        throw Error("user not found by id " + id);
    }
};

function convertUser(row) {
    const user = {};
    user.id = row.id;
    user.email = row.email;
    user.username = row.username;
    user.is_admin = row.is_admin;
    user.first_name = row.first_name;
    user.last_name = row.last_name;
    user.created_at = moment(row.created_at, "YYYY-MM-DD");
    user.created_at = user.created_at.format("YYYY-MM-DD");
    user.updated_at = moment(row.updated_at, "YYYY-MM-DD");
    user.updated_at = user.updated_at.format("YYYY-MM-DD");
    return user;
}
