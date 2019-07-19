const Sequelize = require("sequelize");
const dbHelper = require("../daos/db_helper");
const sequelize = dbHelper.sequelize;
const Model = Sequelize.Model;
class Recipe extends Model {}
Recipe.init(
    {
        // attributes
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "recipee",
        tableName: "the_recipes",
        // options
    }
);

// Note: using `force: true` will drop the table if it already exists
Recipe.sync({force: true}).then(() => {
    return Recipe.create({
        title: "recipe 1",
    });
});
