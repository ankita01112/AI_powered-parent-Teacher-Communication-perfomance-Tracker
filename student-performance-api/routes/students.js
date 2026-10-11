const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/auth'); // Optional: apply to routes if needed

// ✅ CREATE - Add a student
router.post('/', (req, res) => {
  const {
    student_id,
    first_name,
    last_name,
    email,
    phone,
    gender,
    dob,
    course_id,
    semester_id
  } = req.body;

  const sql = `
    INSERT INTO students 
    (student_id, first_name, last_name, email, phone, gender, dob, course_id, semester_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    student_id,
    first_name,
    last_name,
    email,
    phone,
    gender,
    dob,
    course_id,
    semester_id
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Insert Error:', err.sqlMessage || err);
      return res.status(500).json({ error: err.sqlMessage || 'Internal Server Error' });
    }
    res.json({ message: '✅ Student added', id: result.insertId });
  });
});

// ✅ READ - Get all students with course & semester info
router.get('/', (req, res) => {
  const sql = `
    SELECT s.*, 
           c.course_name, 
           sem.semester_number 
    FROM students s
    LEFT JOIN courses c ON s.course_id = c.id
    LEFT JOIN semesters sem ON s.semester_id = sem.id
    ORDER BY s.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Fetch Error:', err);
      return res.status(500).json({ error: 'Failed to fetch students' });
    }
    res.json(results);
  });
});


// FILTER - Get students by course_id and semester_id
router.get('/filter', (req, res) => {
  const { course_id, semester_id } = req.query;

  const sql = `
    SELECT s.*, c.course_name, sem.semester_number
    FROM students s
    LEFT JOIN courses c ON s.course_id = c.id
    LEFT JOIN semesters sem ON s.semester_id = sem.id
    WHERE s.course_id = ? AND s.semester_id = ?
  `;

  db.query(sql, [course_id, semester_id], (err, results) => {
    if (err) {
      console.error('❌ DB Error:', err);
      return res.status(500).json({ error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(results);
  });
});

// ✅ READ - Get student by ID
router.get('/:id', (req, res) => {
  const sql = `
    SELECT s.*, 
           c.course_name, 
           sem.semester_number 
    FROM students s
    LEFT JOIN courses c ON s.course_id = c.id
    LEFT JOIN semesters sem ON s.semester_id = sem.id
    WHERE s.id = ?
  `;

  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error('❌ Fetch Error:', err);
      return res.status(500).json({ error: 'Failed to fetch student' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(results[0]);
  });
});

// ✅ UPDATE - Update student
router.put('/:id', (req, res) => {
  const {
    student_id,
    first_name,
    last_name,
    email,
    phone,
    gender,
    dob,
    course_id,
    semester_id
  } = req.body;

  const sql = `
    UPDATE students SET 
      student_id = ?, 
      first_name = ?, 
      last_name = ?, 
      email = ?, 
      phone = ?, 
      gender = ?, 
      dob = ?, 
      course_id = ?, 
      semester_id = ?
    WHERE id = ?
  `;

  const values = [
    student_id,
    first_name,
    last_name,
    email,
    phone,
    gender,
    dob,
    course_id,
    semester_id,
    req.params.id
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Update Error:', err);
      return res.status(500).json({ error: 'Failed to update student' });
    }
    res.json({ message: '✅ Student updated' });
  });
});

// ✅ DELETE - Delete student
router.delete('/:id', (req, res) => {
  const sql = `DELETE FROM students WHERE id = ?`;
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error('❌ Delete Error:', err);
      return res.status(500).json({ error: 'Failed to delete student' });
    }
    res.json({ message: '🗑️ Student deleted' });
  });
});


module.exports = router;
