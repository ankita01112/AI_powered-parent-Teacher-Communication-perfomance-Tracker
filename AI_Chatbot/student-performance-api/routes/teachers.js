const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_secret_key'; // Store in .env in production

// SIGNUP
router.post('/signup', async (req, res) => {
  const { name, email, phone, password, subject } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO teachers (name, email, phone, password, subject) VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [name, email, phone, hashedPassword, subject], (err, result) => {
      if (err) return res.status(500).json({ error: 'Email already exists or DB error', details: err });

      res.json({ message: '✅ Teacher registered successfully', id: result.insertId });
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err });
  }
});

// LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = `SELECT * FROM teachers WHERE email = ?`;
  db.query(sql, [email], async (err, result) => {
    if (err || result.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const teacher = result[0];
    const match = await bcrypt.compare(password, teacher.password);
    if (!match) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: teacher.id, email: teacher.email }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: '✅ Login successful', token, teacher: { id: teacher.id, name: teacher.name, email: teacher.email } });
  });
});

module.exports = router;
