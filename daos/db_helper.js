console.info("Initializing DB...");
if (!process.env.DATABASE_URL) {
    throw new Error("No DB configured. Set the environment config DATABASE_URL");
}

/////////////////
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

// sequelize.sync().then(() => {
//     console.info("DB synced");
//     const User = require("../model/User");
// });

// sequelize
//     .authenticate()
//     .then(() => {
//         console.log("Connection has been established successfully.");
//     })
//     .catch(err => {
//         console.error("Unable to connect to the database:", err);
//     });
//////////////////
const parseDbUrl = require("parse-database-url");

const dbConfig = parseDbUrl(process.env.DATABASE_URL);
const Pool = require("pg").Pool;
const pool = new Pool({
    user: dbConfig.user,
    host: dbConfig.host,
    database: dbConfig.database,
    password: dbConfig.password,
    port: dbConfig.port,
    ssl: true,
});

console.info("DB initialized");
module.exports.execute = pool;
module.exports.sequelize = sequelize;
