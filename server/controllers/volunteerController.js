const pool = require("../config/db");


// GET /api/volunteers
exports.getVolunteers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM volunteers ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Ошибка при получении волонтёров:", err);
    res.status(500).json({ error: err.message });
  }
};

// POST /api/volunteers
// Поддержка tg_id, чтобы /register в боте мог сразу привязать Telegram
exports.createVolunteer = async (req, res) => {
  const { name, email, phone, tg_id } = req.body;
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
exports.deleteVolunteer = async (req, res) => {
  try {
    const { id } = req.params;
    const q = await pool.query("DELETE FROM volunteers WHERE id = $1 RETURNING id", [id]);
    if (q.rowCount === 0) return res.status(404).json({ error: "Волонтёр не найден" });
    // participation и reports удалятся сами (ON DELETE CASCADE)
    res.json({ success: true });
  } catch (err) {
    console.error("Ошибка при удалении волонтёра:", err);
    res.status(500).json({ error: err.message });
  }
};