const { Pool } = require("pg");

// Подключение к базе через переменную окружения DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Render требует SSL
});

// Проверка соединения при запуске
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Ошибка подключения к БД:", err.message);
  } else {
    console.log("✅ Подключение к БД успешно:", res.rows[0].now);
  }
});

module.exports = pool;
