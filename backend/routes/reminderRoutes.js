const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const {
  getReminders,
  createReminder,
  toggleReminder,
  deleteReminder,
} = require("../controllers/reminderController");

router.get("/", authMiddleware, getReminders);
router.post("/", authMiddleware, createReminder);
router.put("/:id/toggle", authMiddleware, toggleReminder);
router.delete("/:id", authMiddleware, deleteReminder);

module.exports = router;
