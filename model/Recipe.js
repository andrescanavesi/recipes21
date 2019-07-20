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
        titleForUrl: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        ingredients: {
            type: Sequelize.STRING(500),
            allowNull: false,
        },
        steps: {
            type: Sequelize.STRING(1000),
            allowNull: false,
        },
        keywords: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        pendingApproval: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        approvalNotes: {
            type: Sequelize.STRING(500),
            allowNull: true,
        },
        featuredImageName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "recipe",
        tableName: "the_recipes",
        // options
    }
);

// Note: using `force: true` will drop the table if it already exists
Recipe.sync({force: true}).then(() => {
    return Recipe.create({
        title: "recipe 1",
        titleForUrl: "recipe-1",
        description: "desc",
        ingredients: "ingr1 \n ing2",
        steps: "sep1 \n step2",
        active: true,
        pendingApproval: false,
        keywords: "key1,key2",
        featuredImageName: "default.jpg",
    });
});
