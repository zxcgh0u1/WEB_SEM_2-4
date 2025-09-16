const db = require("../config/db");

async function getAllOrganizers() {
  const result = await db.query("SELECT * FROM organizers ORDER BY id");
  return result.rows;
}

async function addOrganizer(name, email, phone) {
  const result = await db.query(
    "INSERT INTO organizers (name, email, phone) VALUES ($1, $2, $3) RETURNING *",
    [name, email, phone]
  );
  return result.rows[0];
}

module.exports = { getAllOrganizers, addOrganizer };
