const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {loginUser} = require('../controllers/loginController')
const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body; // Changed 'username' to 'name'
  
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword }); // Changed 'username' to 'name'
    
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Login Route
router.post('/login', loginUser);

module.exports = router;
