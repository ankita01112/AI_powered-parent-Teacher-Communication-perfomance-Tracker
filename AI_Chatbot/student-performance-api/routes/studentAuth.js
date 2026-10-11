// routes/studentAuth.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// POST: Student login via student_id/email + DOB
router.post('/login', (req, res) => {
  const { identifier, dob } = req.body;

  if (!identifier || !dob) {
    return res.status(400).json({ error: 'Student ID or Email and Date of Birth are required' });
  }

  const sql = `
    SELECT id, student_id, first_name, last_name, email 
    FROM students 
    WHERE (email = ? OR student_id = ?) AND dob = ?
  `;

  db.query(sql, [identifier, identifier, dob], (err, results) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const student = results[0];
    const name = `${student.first_name} ${student.last_name}`;

    res.json({
      message: 'Login successful',
      student: {
        id: student.id,
        student_id: student.student_id,
        email: student.email,
        name,
      },
    });
  });
});

module.exports = router;
