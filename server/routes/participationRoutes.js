const express = require("express");
const router = express.Router();
const participationController = require("../controllers/participationController");

router.get("/", participationController.getParticipation);
router.post("/", participationController.createParticipation);
router.delete("/:id", participationController.deleteParticipation); // ⬅️ добавить

module.exports = router;
