const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/auth'); // JWT auth

// CREATE - Add a new course
router.post('/', verifyToken, (req, res) => {
  const { course_code, course_name } = req.body;

  const sql = `INSERT INTO courses (course_code, course_name) VALUES (?, ?)`;
  db.query(sql, [course_code, course_name], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: '✅ Course added', id: result.insertId });
  });
});

// READ - Get all courses
router.get('/', verifyToken, (req, res) => {
  const sql = `SELECT * FROM courses ORDER BY id DESC`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// READ - Get course by ID
router.get('/:id', verifyToken, (req, res) => {
  const sql = `SELECT * FROM courses WHERE id = ?`;
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ message: 'Course not found' });
    res.json(result[0]);
  });
});

// UPDATE - Update course by ID
router.put('/:id', verifyToken, (req, res) => {
  const { course_code, course_name } = req.body;
  const sql = `UPDATE courses SET course_code = ?, course_name = ? WHERE id = ?`;
  db.query(sql, [course_code, course_name, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: '✅ Course updated' });
  });
});

// DELETE - Delete course by ID
router.delete('/:id', verifyToken, (req, res) => {
  const sql = `DELETE FROM courses WHERE id = ?`;
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: '🗑️ Course deleted' });
  });
});

module.exports = router;
