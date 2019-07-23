if (!process.env.DATABASE_URL) {
    throw new Error("No DB configured. Set the environment config DATABASE_URL");
}

const Sequelize = require("sequelize");
const options = {
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};
const sequelize = new Sequelize(process.env.DATABASE_URL, options);
module.exports.sequelize = sequelize;
