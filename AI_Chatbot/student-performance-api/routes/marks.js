const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ Helper: Recalculate and update student average (no res.json here)
function updateStudentAverage(student_id, callback) {
  const avgSql = `SELECT AVG(marks_obtained) AS avg_marks FROM student_marks WHERE student_id = ?`;
  db.query(avgSql, [student_id], (err, result) => {
    if (err) return callback(err);

    const avgMarks = result[0].avg_marks || 0;
    const updateSql = `UPDATE students SET avg_test_score = ? WHERE id = ?`;
    db.query(updateSql, [avgMarks, student_id], (err2) => {
      if (err2) return callback(err2);
      callback(null); // Success
    });
  });
}

// ✅ CREATE - Insert Marks
router.post('/', (req, res) => {
  const { student_id, subject_id, marks_obtained, total_marks, exam_date } = req.body;

  const sql = `
    INSERT INTO student_marks (student_id, subject_id, marks_obtained, total_marks, exam_date)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [student_id, subject_id, marks_obtained, total_marks, exam_date], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    updateStudentAverage(student_id, (avgErr) => {
      if (avgErr) return res.status(500).json({ error: avgErr.message });

      res.status(200).json({
        success: true,
        message: '✅ Marks inserted and average updated',
        inserted_id: result.insertId
      });
    });
  });
});

// ✅ READ all
router.get('/', (req, res) => {
  const sql = `
    SELECT 
      sm.*, 
      s.first_name, 
      s.last_name, 
      sub.subject_name
    FROM student_marks sm
    JOIN students s ON sm.student_id = s.id
    JOIN subjects sub ON sm.subject_id = sub.id
    ORDER BY sm.id DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ READ by student
router.get('/student/:student_id', (req, res) => {
  const sql = `
    SELECT sm.*, sub.subject_name 
    FROM student_marks sm
    JOIN subjects sub ON sm.subject_id = sub.id
    WHERE sm.student_id = ?
  `;
  db.query(sql, [req.params.student_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ UPDATE marks
router.put('/:id', (req, res) => {
  const { student_id, subject_id, marks_obtained, total_marks, exam_date } = req.body;

  const sql = `
    UPDATE student_marks SET 
      student_id = ?, subject_id = ?, marks_obtained = ?, total_marks = ?, exam_date = ?
    WHERE id = ?
  `;
  db.query(sql, [student_id, subject_id, marks_obtained, total_marks, exam_date, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    updateStudentAverage(student_id, (avgErr) => {
      if (avgErr) return res.status(500).json({ error: avgErr.message });

      res.status(200).json({ success: true, message: '✅ Marks updated and average recalculated' });
    });
  });
});

// ✅ DELETE marks
router.delete('/:id', (req, res) => {
  const sql = `SELECT student_id FROM student_marks WHERE id = ?`;
  db.query(sql, [req.params.id], (err, result) => {
    if (err || result.length === 0) {
      return res.status(404).json({ error: 'Marks record not found' });
    }

    const student_id = result[0].student_id;

    db.query(`DELETE FROM student_marks WHERE id = ?`, [req.params.id], (err) => {
      if (err) return res.status(500).json({ error: err.message });

      updateStudentAverage(student_id, (avgErr) => {
        if (avgErr) return res.status(500).json({ error: avgErr.message });

        res.status(200).json({ success: true, message: '🗑️ Marks deleted and average updated' });
      });
    });
  });
});

module.exports = router;
