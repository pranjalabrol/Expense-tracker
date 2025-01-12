const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const { addExpense, getExpenses } = require("../controllers/expenseController"); // Import functions from controller

router.get("/", getExpenses);
router.post("/", addExpense);
module.exports = router;
