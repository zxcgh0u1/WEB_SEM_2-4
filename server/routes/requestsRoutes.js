const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const axios = require("axios");

// ⚠️ Подставь свой токен
const BOT_TOKEN = "8484189161:AAHGHJM8a-VhTGRnB0uKSgwb0h-42NLgNpc";
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Получить все заявки
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM requests ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Ошибка при получении заявок:", err);
    res.status(500).json({ error: err.message });
  }
});

// Создать заявку
router.post("/", async (req, res) => {
  const { tg_id, username, event_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO requests (tg_id, username, event_id) VALUES ($1, $2, $3) RETURNING *",
      [tg_id, username, event_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка при создании заявки:", err);
    res.status(500).json({ error: err.message });
  }
});

// Одобрить заявку
router.put("/:id/approve", async (req, res) => {
  try {
    const request = await pool.query("SELECT * FROM requests WHERE id = $1", [req.params.id]);
    if (request.rows.length === 0) return res.status(404).json({ error: "Заявка не найдена" });

    const { tg_id, event_id } = request.rows[0];

    // Находим волонтёра по tg_id
    const volunteer = await pool.query("SELECT id FROM volunteers WHERE tg_id = $1", [tg_id]);
    if (volunteer.rows.length === 0) {
      return res.status(400).json({ error: "Волонтёр с таким tg_id не найден. Нужно зарегистрироваться через /register" });
    }

    const volunteer_id = volunteer.rows[0].id;

    // Записываем участие
    await pool.query(
      "INSERT INTO participation (volunteer_id, event_id, status) VALUES ($1, $2, $3)",
      [volunteer_id, event_id, "approved"]
    );

    // Удаляем заявку
    await pool.query("DELETE FROM requests WHERE id = $1", [req.params.id]);

    // Уведомляем волонтёра
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: tg_id,
      text: `✅ Ваша заявка на участие в мероприятии #${event_id} одобрена!`,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Ошибка при одобрении заявки:", err);
    res.status(500).json({ error: err.message });
  }
});

// Отклонить заявку
router.put("/:id/reject", async (req, res) => {
  try {
    const request = await pool.query("SELECT * FROM requests WHERE id = $1", [req.params.id]);
    if (request.rows.length === 0) return res.status(404).json({ error: "Заявка не найдена" });

    const { tg_id, event_id } = request.rows[0];

    // Удаляем заявку
    await pool.query("DELETE FROM requests WHERE id = $1", [req.params.id]);

    // Уведомляем волонтёра
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: tg_id,
      text: `❌ Ваша заявка на участие в мероприятии #${event_id} отклонена.`,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Ошибка при отклонении заявки:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
