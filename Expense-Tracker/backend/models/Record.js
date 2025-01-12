const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Date, // or Date if you want to store it as a date object
    required: true,
  },
});

module.exports = mongoose.model('Record', recordSchema);
