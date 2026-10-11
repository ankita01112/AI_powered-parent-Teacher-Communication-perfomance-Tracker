const express = require("express");
const router = express.Router();
const db = require("../db");
const sendEmail = require("../mailer"); // your SMTP mailer setup

// ✅ Helper: Update attendance % and send email if low (after res is sent)
function updateAttendancePercentage(student_id, res, finalMsg = "") {
  const attendanceSql = `
    SELECT 
      student_id, 
      ROUND(SUM(status = 'Present') / COUNT(*) * 100, 2) AS attendance_percentage 
    FROM student_attendance 
    WHERE student_id = ? 
    GROUP BY student_id
  `;

  db.query(attendanceSql, [student_id], (err2, result) => {
    if (err2) {
      console.error("❌ Attendance % Query Error:", err2);
      return res.status(500).json({ error: err2.message || err2 });
    }

    const percent = result[0]?.attendance_percentage || 0;

    db.query(
      `UPDATE students SET attendance = ? WHERE id = ?`,
      [percent, student_id],
      (err3) => {
        if (err3) {
          console.error("❌ Attendance % Update Error:", err3);
          return res.status(500).json({ error: err3.message || err3 });
        }

        // ✅ Final response to frontend
        res.json({
          message: finalMsg || "✅ Attendance recorded and updated",
          attendance: percent,
        });

        // 📨 Email logic AFTER sending response (no res used here)
        if (percent < 75) {
          db.query(
            `SELECT email, first_name FROM students WHERE id = ?`,
            [student_id],
            (err4, result2) => {
              if (err4) {
                console.warn("⚠️ Email lookup failed:", err4);
                return;
              }

              if (result2.length > 0) {
                const student = result2[0];
                const msg = `
                  Dear ${student.first_name},

                  Your current attendance is ${percent}%.
                  Please maintain above 75% to avoid academic issues.

                  Regards,  
                  Attendance Monitor`;

                try {
                  sendEmail(student.email, "⚠️ Low Attendance Alert", msg);
                  console.log(`📨 Email sent to ${student.email}`);
                } catch (e) {
                  console.warn("📧 Email send error:", e.message || e);
                }
              }
            }
          );
        }
      }
    );
  });
}

// ✅ CREATE - Record attendance
router.post("/", (req, res) => {
  const { student_id, date, status } = req.body;

  if (!student_id || !date || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const insertSql = `
    INSERT INTO student_attendance (student_id, date, status)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE status = VALUES(status)
  `;

  db.query(insertSql, [student_id, date, status], (err) => {
    if (err) {
      console.error("❌ INSERT ERROR:", err.sqlMessage || err.message || err);
      return res
        .status(500)
        .json({ error: err.sqlMessage || err.message || err });
    }

    updateAttendancePercentage(
      student_id,
      res,
      "✅ Attendance recorded and updated"
    );
  });
});

// ✅ READ - All attendance records
// READ - All attendance records
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      sa.*, 
      s.first_name, 
      s.last_name, 
      s.course_id, 
      s.semester_id
    FROM student_attendance sa 
    JOIN students s ON sa.student_id = s.id 
    ORDER BY sa.date DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// ✅ READ - Attendance for a specific student
router.get("/student/:student_id", (req, res) => {
  const sql = `
    SELECT date, status 
    FROM student_attendance 
    WHERE student_id = ? 
    ORDER BY date DESC
  `;
  db.query(sql, [req.params.student_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message || err });
    res.json(results);
  });
});

// ✅ UPDATE - Edit attendance for a specific record
router.put("/:id", (req, res) => {
  const { student_id, date, status } = req.body;

  if (!student_id || !date || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const updateSql = `UPDATE student_attendance SET student_id = ?, date = ?, status = ? WHERE id = ?`;

  db.query(updateSql, [student_id, date, status, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message || err });
    updateAttendancePercentage(
      student_id,
      res,
      "✅ Attendance updated and percentage recalculated"
    );
  });
});

// ✅ DELETE - Delete a record and update percentage
router.delete("/:id", (req, res) => {
  db.query(
    `SELECT student_id FROM student_attendance WHERE id = ?`,
    [req.params.id],
    (err, result) => {
      if (err || result.length === 0) {
        return res.status(404).json({ message: "Record not found" });
      }

      const student_id = result[0].student_id;

      db.query(
        `DELETE FROM student_attendance WHERE id = ?`,
        [req.params.id],
        (err2) => {
          if (err2)
            return res.status(500).json({ error: err2.message || err2 });
          updateAttendancePercentage(
            student_id,
            res,
            "🗑️ Record deleted and attendance updated"
          );
        }
      );
    }
  );
});

module.exports = router;
