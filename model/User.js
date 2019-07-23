const {sequelize} = require("../daos/sequelize");
//const Sequelize = require("sequelize");

const Sequelize = require("sequelize");
// const options = {
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000,
//     },
// };
// const sequelize = new Sequelize(process.env.DATABASE_URL, options);

const Model = Sequelize.Model;
class User extends Model {}
User.init(
    {
        // attributes
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        userName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        firstName: {
            type: Sequelize.STRING,
        },
        lastName: {
            type: Sequelize.STRING,
        },
        isAdmin: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: "user",
        // options
    }
);

module.exports.User = User;

// module.exports.create = function(user) {
//     return User.create(user);
// };

// module.exports.findByEmail = function(email) {
//     return User.findAll({where: {email: email}});
// };

// module.exports.create = function(user) {
//     return dbHelper.User.create(user);
// };
