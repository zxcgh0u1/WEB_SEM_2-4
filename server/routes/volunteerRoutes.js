const express = require("express");
const router = express.Router();
const volunteerController = require("../controllers/volunteerController");
const pool = require("../config/db"); // ✅ нужен для ручного запроса в /by-tg

// Получить всех волонтёров
router.get("/", volunteerController.getVolunteers);

// Добавить волонтёра
router.post("/", volunteerController.createVolunteer);

// Поиск волонтёра по tg_id (для бота)
router.get("/by-tg/:tg_id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM volunteers WHERE tg_id = $1", [req.params.tg_id]);
    res.json(result.rows[0] || null);
  } catch (err) {
    console.error("Ошибка при поиске волонтёра по tg_id:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; // ✅ экспорт в самом конце
exports.createVolunteer = async (req, res) => {
  const { name, email, phone, tg_id } = req.body;

  // Проверка email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Некорректный email" });
  }

  // Проверка телефона (10–15 цифр, можно с +)
  const phoneRegex = /^\+?\d{10,15}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: "Некорректный телефон" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO volunteers (name, email, phone, tg_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, phone, tg_id || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка при добавлении волонтёра:", err);
    res.status(500).json({ error: err.message });
  }
};
router.delete("/:id", volunteerController.deleteVolunteer);
module.exports = router;
