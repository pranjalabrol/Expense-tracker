const express = require('express');
const router = express.Router();
const Record = require('../models/Record'); // The MongoDB Record model

// Add a record
router.post('/add-record', async (req, res) => {
  const { amount, category, date } = req.body;

  if (!amount || !category || !date) {
    return res.status(400).json({ message: 'Amount, category, and date are required' });
  }

  try {
    const record = new Record({ amount, category, date });
    await record.save();
    res.status(200).json({ message: 'Expense added successfully' });
  } catch (err) {
    console.error('Error adding expense:', err.message);
    res.status(500).json({ message: `Error adding expense: ${err.message}` });
  }
});



// Get all records
router.get('/get-records', async (req, res) => {
  try {
    const records = await Record.find().sort({ date: 1 });
    res.status(200).json(records);
  } catch (err) {
    console.error('Error fetching records:', err);
    res.status(500).json({ message: 'Error fetching records' });
  }
});

// Get records for a specific date
router.get('/get-records/:date', async (req, res) => {
  const { date } = req.params;

  try {
    const records = await Record.find({ date });
    res.status(200).json(records);
  } catch (err) {
    console.error('Error fetching records:', err);
    res.status(500).json({ message: 'Error fetching records' });
  }
});

// Delete a record by ID
router.delete('/delete-record/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Record.findByIdAndDelete(id);
    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (err) {
    console.error('Error deleting record:', err);
    res.status(500).json({ message: 'Error deleting record' });
  }
});

// Get records for a specific month and year
router.get('/get-monthly-records', async (req, res) => {
  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).json({ message: 'Year and month are required' });
  }

  try {
    // Convert year and month to a date range
    const startDate = new Date(`${year}-${month}-01T00:00:00Z`);
    const endDate = new Date(`${year}-${month}-01T00:00:00Z`);
    endDate.setMonth(endDate.getMonth() + 1); // Move to the next month

    // Fetch records within the date range
    const records = await Record.find({
      date: { $gte: startDate, $lt: endDate },
    }).sort({ date: 1 });

    res.status(200).json(records);
  } catch (err) {
    console.error('Error fetching monthly records:', err.message);
    res.status(500).json({ message: 'Error fetching monthly records' });
  }
});
// Get summarized data
router.get('/get-summary', async (req, res) => {
  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).json({ message: 'Year and month are required' });
  }

  try {
    // Convert year and month to a date range
    const startDate = new Date(`${year}-${month}-01T00:00:00Z`);
    const endDate = new Date(`${year}-${month}-01T00:00:00Z`);
    endDate.setMonth(endDate.getMonth() + 1);

    // Fetch records within the date range
    const records = await Record.find({
      date: { $gte: startDate, $lt: endDate },
    });

    // Calculate total expenses and breakdowns
    const totalExpense = records.reduce((sum, record) => sum + record.amount, 0);

    const categoryBreakdown = records.reduce((acc, record) => {
      acc[record.category] = (acc[record.category] || 0) + record.amount;
      return acc;
    }, {});

    const highestSpendingCategory = Object.entries(categoryBreakdown).reduce(
      (max, [category, amount]) => (amount > max.amount ? { category, amount } : max),
      { category: null, amount: 0 }
    );

    res.status(200).json({
      totalExpense,
      highestSpendingCategory,
      categoryBreakdown,
      detailedRecords: records,
    });
  } catch (err) {
    console.error('Error fetching summary:', err.message);
    res.status(500).json({ message: 'Error fetching summary' });
  }
});


module.exports = router;
