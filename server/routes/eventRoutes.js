const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

// получить все мероприятия
router.get("/", eventController.getEvents);

// создать новое мероприятие
router.post("/", eventController.createEvent);
router.delete("/:id", eventController.deleteEvent); // ⬅️ добавить

module.exports = router;
