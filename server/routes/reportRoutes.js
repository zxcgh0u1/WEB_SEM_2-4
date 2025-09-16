const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

router.get("/", reportController.getReports);
router.post("/", reportController.createReport);
router.delete("/:id", reportController.deleteReport); // ⬅️ добавить

module.exports = router;
