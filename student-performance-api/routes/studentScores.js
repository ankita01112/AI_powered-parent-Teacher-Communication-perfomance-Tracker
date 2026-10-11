const express = require('express');
const router = express.Router();
const db = require('../db');

// Create or update project & assignment scores for a student
router.post('/', (req, res) => {
  const { student_id, project_score, assignment_score } = req.body;

  const checkSql = `SELECT id FROM student_scores WHERE student_id = ?`;
  db.query(checkSql, [student_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length > 0) {
      // Update existing record
      const updateSql = `
        UPDATE student_scores 
        SET project_score = ?, assignment_score = ? 
        WHERE student_id = ?
      `;
      db.query(updateSql, [project_score, assignment_score, student_id], (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ success: true, message: 'Scores updated' });
      });
    } else {
      // Insert new record
      const insertSql = `
        INSERT INTO student_scores (student_id, project_score, assignment_score) 
        VALUES (?, ?, ?)
      `;
      db.query(insertSql, [student_id, project_score, assignment_score], (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ success: true, message: 'Scores added' });
      });
    }
  });
});

// Get all scores
router.get('/', (req, res) => {
  const sql = `
    SELECT ss.*, s.first_name, s.last_name 
    FROM student_scores ss
    JOIN students s ON ss.student_id = s.id
    ORDER BY ss.updated_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get scores by student
router.get('/student/:student_id', (req, res) => {
  const sql = `SELECT * FROM student_scores WHERE student_id = ?`;
  db.query(sql, [req.params.student_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0] || {});
  });
});

module.exports = router;
