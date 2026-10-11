//const mysql = require('mysql2');
//const db = mysql.createConnection({
 // host: 'localhost',
  //user: 'root',
 // password: '', // your MySQL password
  //database: 'ai_chatbot'
//});

//db.connect(err => {
  //if (err) throw err;
  //console.log('✅ Connected to MySQL');
//});

//module.exports = db;

const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 14538),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
  ca: process.env.DB_CA_CERT?.replace(/\\n/g, '\n'),
  rejectUnauthorized: true
}
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection failed:', err);
    return;
  }

  console.log('Connected to Aiven MySQL!');
});

module.exports = db;
