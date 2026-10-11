const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/auth');

// CREATE - Add new semester
router.post('/', verifyToken, (req, res) => {
  const { course_id, semester_number } = req.body;
  const sql = `INSERT INTO semesters (course_id, semester_number) VALUES (?, ?)`;
  db.query(sql, [course_id, semester_number], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: '✅ Semester added', id: result.insertId });
  });
});

// READ - Get all semesters (optionally by course)
router.get('/', verifyToken, (req, res) => {
  const { course_id } = req.query;
  const sql = course_id
    ? `SELECT semesters.*, courses.course_name FROM semesters JOIN courses ON semesters.course_id = courses.id WHERE course_id = ? ORDER BY semester_number`
    : `SELECT semesters.*, courses.course_name FROM semesters JOIN courses ON semesters.course_id = courses.id ORDER BY course_id, semester_number`;

  db.query(sql, course_id ? [course_id] : [], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// UPDATE - Update semester
router.put('/:id', verifyToken, (req, res) => {
  const { course_id, semester_number } = req.body;
  const sql = `UPDATE semesters SET course_id = ?, semester_number = ? WHERE id = ?`;
  db.query(sql, [course_id, semester_number, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: '✅ Semester updated' });
  });
});

// DELETE - Delete semester
router.delete('/:id', verifyToken, (req, res) => {
  const sql = `DELETE FROM semesters WHERE id = ?`;
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: '🗑️ Semester deleted' });
  });
});

module.exports = router;
