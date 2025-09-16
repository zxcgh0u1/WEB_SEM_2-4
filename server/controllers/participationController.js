const participationModel = require("../models/participationModel");
const pool = require("../config/db");

const getParticipation = async (req, res) => {
  try {
    const participation = await participationModel.getAllParticipation();
    res.json(participation);
  } catch (err) {
    console.error("Ошибка при получении participation:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

const createParticipation = async (req, res) => {
  const { volunteer_id, event_id, status } = req.body;
  try {
    const newParticipation = await participationModel.addParticipation(volunteer_id, event_id, status);
    res.status(201).json(newParticipation);
  } catch (err) {
    console.error("Ошибка при создании participation:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};
const deleteParticipation = async (req, res) => {
  try {
    const { id } = req.params;
    const q = await pool.query("DELETE FROM participation WHERE id = $1 RETURNING id", [id]);
    if (q.rowCount === 0) return res.status(404).json({ error: "Запись участия не найдена" });
    res.json({ success: true });
  } catch (err) {
    console.error("Ошибка при удалении участия:", err);
    res.status(500).json({ error: err.message });
  }
};
module.exports = { getParticipation, createParticipation, deleteParticipation };
