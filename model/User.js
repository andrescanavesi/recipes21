const dbHelper = require("../daos/db_helper");

module.exports.findByEmail = function(email) {
    return dbHelper.User.findAll({where: {email: email}});
};

module.exports.create = function(user) {
    return dbHelper.User.create(user);
};
