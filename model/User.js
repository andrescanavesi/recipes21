const Sequelize = require("sequelize");
const dbHelper = require("../daos/db_helper");
const sequelize = dbHelper.sequelize;
const Model = Sequelize.Model;
class User extends Model {}
User.init(
    {
        // attributes
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        lastName: {
            type: Sequelize.STRING,
            // allowNull defaults to true
        },
    },
    {
        sequelize,
        modelName: "user",
        // options
    }
);

// Note: using `force: true` will drop the table if it already exists
User.sync({force: true}).then(() => {
    // Now the `users` table in the database corresponds to the model definition
    return User.create({
        firstName: "John",
        lastName: "Hancock",
    });
});

// Find all users
User.findAll().then(users => {
    console.log("All users:", JSON.stringify(users, null, 4));
});

// Create a new user
User.create({firstName: "Jane", lastName: "Doe"}).then(jane => {
    console.log("Jane's auto-generated ID:", jane.id);
});

// Delete everyone named "Jane"
User.destroy({
    where: {
        firstName: "Jane",
    },
}).then(() => {
    console.log("Done");
});

// Change everyone without a last name to "Doe"
User.update(
    {lastName: "Doe"},
    {
        where: {
            lastName: null,
        },
    }
).then(() => {
    console.log("Done");
});
