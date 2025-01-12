const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const recordRoutes = require('./routes/recordRoutes'); // New routes for record management

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use((err, req, res, next) => {
  console.error(err.stack); // Log stack trace
  res.status(500).send('Something went wrong!');
});

app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// Log all requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/records', recordRoutes); // New API routes for records
app.use('/api/summary', recordRoutes);
// Serve React App
app.use((req, res, next) => {
  if (!req.originalUrl.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
  } else {
    next();
  }
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
