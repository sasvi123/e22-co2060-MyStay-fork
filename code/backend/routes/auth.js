const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const pool = req.pool; // Use the pool passed from server.js

  try {
    // 1. Check if user exists
    const [users] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const user = users[0];

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // 3. Create a JWT Token
    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.user_id,
        name: user.name,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    // Destructuring safely
    const { name, email, phone, password, role } = req.body;
    const pool = req.pool; 

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // 1. Check if user exists
        const [existing] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Insert into DB
        const query = 'INSERT INTO Users (name, email, phone, role, password) VALUES (?, ?, ?, ?, ?)';
        await pool.query(query, [name, email, phone, role || 'student', hashedPassword]);

        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;