const pool = require("../config/db");

// Получить все отчёты
async function getAllReports() {
  const result = await pool.query("SELECT * FROM activity_reports ORDER BY created_at DESC");
  return result.rows;
}

// Получить отчёты конкретного волонтёра
async function getReportsByVolunteer(volunteer_id) {
  const result = await pool.query(
    "SELECT * FROM activity_reports WHERE volunteer_id = $1 ORDER BY created_at DESC",
    [volunteer_id]
  );
  return result.rows;
}

// Добавить отчёт
async function addReport(volunteer_id, event_id, hours, feedback) {
  const result = await pool.query(
    `INSERT INTO activity_reports (volunteer_id, event_id, hours, feedback)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [volunteer_id, event_id, hours, feedback]
  );
  return result.rows[0];
}

module.exports = { getAllReports, getReportsByVolunteer, addReport };
