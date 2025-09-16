const { Pool } = require("pg");

const pool = new Pool({
  user: "egor",       // замени на своего
  host: "localhost",
  database: "volunteers_db", // база из SQL-скрипта
  password: "1234",    // замени на своего
  port: 5432,
});

module.exports = pool;
