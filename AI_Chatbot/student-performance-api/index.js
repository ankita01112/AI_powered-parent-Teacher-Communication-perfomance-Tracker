const express = require('express');
const cors = require('cors');
const axios = require('axios');
const db = require('./db'); // MySQL connection

// Routes
const studentRoutes = require('./routes/students');
const subjectRoutes = require('./routes/subjects');
const marksRoutes = require('./routes/marks');
const attendanceRoutes = require('./routes/attendance');
const teachers = require('./routes/teachers')
const courses = require('./routes/courses')
const semester = require('./routes/semesters')

const studentAuth = require('./routes/studentAuth');


const app = express();
app.use(cors());
app.use(express.json());

// Mount API routes
app.use('/api/students', studentRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/teachers', teachers);
app.use('/api/courses', courses);
app.use('/api/semesters', semester);

app.use('/api/student-auth', studentAuth);



// ML Prediction route (calls Flask)
const sendEmail = require('./mailer');

app.post('/api/predict', async (req, res) => {
  try {
    const response = await axios.post('http://127.0.0.1:5000/predict', req.body);
    const prediction = response.data.prediction;
    const studentId = req.body.student_id;

    // 1. Update current prediction in students table
    if (studentId) {
      db.query(`UPDATE students SET last_prediction = ? WHERE id = ?`, [prediction, studentId]);
    }

    // 2. Save prediction in history table
    db.query(
      `INSERT INTO student_predictions (student_id, prediction) VALUES (?, ?)`,
      [studentId, prediction],
      (err, result) => {
        if (err) {
          console.error("❌ Failed to insert prediction:", err.message);
        } else {
          console.log("✅ Prediction saved in history");
        }
      }
    );


    // 3. Get student email
    db.query(`SELECT email, first_name FROM students WHERE id = ?`, [studentId], (err, results) => {
      if (!err && results.length > 0) {
        const student = results[0];

        // 4. If prediction is "Low", send email alert
        if (prediction === 'Low') {
          const msg = `Dear ${student.first_name},\n\nOur system has detected a low performance risk. Please consult your faculty for academic support.\n\nRegards,\nAcademic Monitoring System`;
          sendEmail(student.email, '⚠️ Low Performance Alert', msg);
        }
      }
    });

    res.json({ prediction });
  } catch (err) {
    console.error('Flask Error:', err.message);
    res.status(500).json({ error: 'Prediction failed.' });
  }
});



// Start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Node.js server running at http://localhost:${PORT}`);
});
