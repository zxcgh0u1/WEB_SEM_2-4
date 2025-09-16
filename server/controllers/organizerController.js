const organizerModel = require("../models/organizerModel");
const pool = require("../config/db");

const getOrganizers = async (req, res) => {
  try {
    const organizers = await organizerModel.getAllOrganizers();
    res.json(organizers);
  } catch (err) {
    console.error("Ошибка при получении организаторов:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

const createOrganizer = async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    const newOrganizer = await organizerModel.addOrganizer(name, email, phone);
    res.status(201).json(newOrganizer);
  } catch (err) {
    console.error("Ошибка при создании организатора:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};
const deleteOrganizer = async (req, res) => {
  try {
    const { id } = req.params;
    const q = await pool.query("DELETE FROM organizers WHERE id = $1 RETURNING id", [id]);
    if (q.rowCount === 0) return res.status(404).json({ error: "Организатор не найден" });
    // events.organizer_id уедет в NULL (ON DELETE SET NULL)
    res.json({ success: true });
  } catch (err) {
    console.error("Ошибка при удалении организатора:", err);
    res.status(500).json({ error: err.message });
  }
};
module.exports = { getOrganizers, createOrganizer, deleteOrganizer };
