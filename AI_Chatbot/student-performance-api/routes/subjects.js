const express = require('express');
const router = express.Router();
const db = require('../db');

// CREATE - Add subject
router.post('/', (req, res) => {
  const { subject_code, subject_name, semester, course } = req.body;
  const sql = `INSERT INTO subjects (subject_code, subject_name, semester, course) VALUES (?, ?, ?, ?)`;

  db.query(sql, [subject_code, subject_name, semester, course], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: '✅ Subject added', id: result.insertId });
  });
});

// READ - Get all subjects
router.get('/', (req, res) => {
  const sql = `SELECT * FROM subjects ORDER BY id DESC`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// READ - Get single subject by ID
router.get('/:id', (req, res) => {
  const sql = `SELECT * FROM subjects WHERE id = ?`;
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ message: 'Subject not found' });
    res.json(result[0]);
  });
});

// UPDATE - Update subject by ID
router.put('/:id', (req, res) => {
  const { subject_code, subject_name, semester, course } = req.body;
  const sql = `
    UPDATE subjects SET 
      subject_code = ?, 
      subject_name = ?, 
      semester = ?, 
      course = ? 
    WHERE id = ?`;

  db.query(sql, [subject_code, subject_name, semester, course, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: '✅ Subject updated' });
  });
});

// DELETE - Delete subject by ID
router.delete('/:id', (req, res) => {
  const sql = `DELETE FROM subjects WHERE id = ?`;
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: '🗑️ Subject deleted' });
  });
});

module.exports = router;
