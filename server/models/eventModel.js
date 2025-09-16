const pool = require("../config/db");

// Получить все мероприятия с подробностями
async function getAllEventsDetailed() {
  const result = await pool.query(`
    SELECT 
      e.id,
      e.title,
      e.description,
      e.date,
      e.max_participants,
      o.name AS organizer_name,
      COUNT(p.volunteer_id) AS current_participants
    FROM events e
    LEFT JOIN organizers o ON e.organizer_id = o.id
    LEFT JOIN participation p ON e.id = p.event_id
    GROUP BY e.id, o.name
    ORDER BY e.date
  `);
  return result.rows;
}

// Добавить мероприятие
async function addEvent(title, description, date, max_participants, organizer_id) {
  const result = await pool.query(
    `INSERT INTO events (title, description, date, max_participants, organizer_id) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [title, description, date, max_participants, organizer_id]
  );
  return result.rows[0];
}

module.exports = { getAllEventsDetailed, addEvent };
