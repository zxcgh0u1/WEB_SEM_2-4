const reportModel = require("../models/reportModel");
const pool = require("../config/db");

const getReports = async (req, res) => {
  try {
    const { volunteer_id } = req.query;

    let reports;
    if (volunteer_id) {
      reports = await reportModel.getReportsByVolunteer(volunteer_id);
    } else {
      reports = await reportModel.getAllReports();
    }

    res.json(reports);
  } catch (err) {
    console.error("Ошибка при получении отчётов:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};


const createReport = async (req, res) => {
  const { volunteer_id, event_id, hours, feedback } = req.body;
  try {
    const newReport = await reportModel.addReport(volunteer_id, event_id, hours, feedback);
    res.status(201).json(newReport);
  } catch (err) {
    console.error("Ошибка при создании отчёта:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};
const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const q = await pool.query("DELETE FROM activity_reports WHERE id = $1 RETURNING id", [id]);
    if (q.rowCount === 0) return res.status(404).json({ error: "Отчёт не найден" });
    res.json({ success: true });
  } catch (err) {
    console.error("Ошибка при удалении отчёта:", err);
    res.status(500).json({ error: err.message });
  }
};
module.exports = { getReports, createReport, deleteReport };
