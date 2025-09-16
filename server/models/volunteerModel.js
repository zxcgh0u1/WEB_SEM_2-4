const db = require("../config/db");

async function getAllVolunteers() {
  const result = await db.query("SELECT * FROM volunteers ORDER BY id");
  return result.rows;
}

async function addVolunteer(name, email, phone) {
  const result = await db.query(
    "INSERT INTO volunteers (name, email, phone) VALUES ($1, $2, $3) RETURNING *",
    [name, email, phone]
  );
  return result.rows[0];
}

module.exports = { getAllVolunteers, addVolunteer };
