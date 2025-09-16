const db = require("../config/db");

async function getAllParticipation() {
  const result = await db.query("SELECT * FROM participation ORDER BY id");
  return result.rows;
}

async function addParticipation(volunteer_id, event_id, status = "registered") {
  const result = await db.query(
    "INSERT INTO participation (volunteer_id, event_id, status) VALUES ($1, $2, $3) RETURNING *",
    [volunteer_id, event_id, status]
  );
  return result.rows[0];
}

module.exports = { getAllParticipation, addParticipation };
