const Expense = require("../models/Expense");

// @desc Get all expenses for a user
// @route GET /api/expenses
// @access Private
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }); // Fetch expenses by user ID
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
};

// @desc Add a new expense
// @route POST /api/expenses
// @access Private
const addExpense = async (req, res) => {
  const { name, amount, date } = req.body;

  if (!name || !amount || !date) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const newExpense = await Expense.create({
      name,
      amount,
      date,
      user: req.user.id, // Associate expense with logged-in user
    });

    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ message: "Failed to add expense" });
  }
};

module.exports = {
  getExpenses,
  addExpense,
};
