const express = require("express");
const router = express.Router();
const organizerController = require("../controllers/organizerController");

// получить всех организаторов
router.get("/", organizerController.getOrganizers);

// добавить организатора
router.post("/", organizerController.createOrganizer);

router.delete("/:id", organizerController.deleteOrganizer); // ⬅️ добавить



module.exports = router;
