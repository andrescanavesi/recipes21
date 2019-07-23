const sequelize = require("../daos/sequelize");
const Sequelize = require("sequelize");
const Model = Sequelize.Model;
class Recipe extends Model {}

module.exports.setup = function() {
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
            //tableName: "the_recipes",
            // options
        }
    );
};
