const eventModel = require("../models/eventModel");
const pool = require("../config/db");

// Получить все мероприятия
const getEvents = async (req, res) => {
  try {
    const events = await eventModel.getAllEventsDetailed();
    res.json(events);
  } catch (err) {
    console.error("Ошибка при получении мероприятий:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// Создать новое мероприятие
const createEvent = async (req, res) => {
  const { title, description, date, max_participants, organizer_id } = req.body;
  try {
    const newEvent = await eventModel.addEvent(
      title,
      description,
      date,
      max_participants,
      organizer_id
    );
    res.status(201).json(newEvent);
  } catch (err) {
    console.error("Ошибка при создании мероприятия:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// Удалить мероприятие
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const q = await pool.query("DELETE FROM events WHERE id = $1 RETURNING id", [id]);
    if (q.rowCount === 0) {
      return res.status(404).json({ error: "Мероприятие не найдено" });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Ошибка при удалении мероприятия:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getEvents, createEvent, deleteEvent };
