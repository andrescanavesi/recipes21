const Pool = require("pg").Pool;
console.info("Initializing DB...");
const pool = new Pool({
  user: process.env.RC_DB_USER,
  host: process.env.RC_DB_HOST,
  database: process.env.RC_DB_NAME,
  password: process.env.RC_DB_PASSWORD,
  port: process.env.RC_DB_PORT,
  ssl: true
});

console.info("DB initialized");
module.exports.pool = pool;
