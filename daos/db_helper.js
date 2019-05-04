console.info("Initializing DB...");
if (!process.env.DATABASE_URL) {
  throw new Error("No DB configured. Set the environment config DATABASE_URL");
}
const parseDbUrl = require("parse-database-url");

const dbConfig = parseDbUrl(process.env.DATABASE_URL);
const Pool = require("pg").Pool;
const pool = new Pool({
  user: dbConfig.user,
  host: dbConfig.host,
  database: dbConfig.database,
  password: dbConfig.password,
  port: dbConfig.port,
  ssl: true
});

console.info("DB initialized");
module.exports.execute = pool;
