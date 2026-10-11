const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ankita.m.jha01@gmail.com',        // your Gmail address
    pass: 'mizt ljsh fmfm slie'       // app password (not your Gmail password)
  }
});

function sendEmail(to, subject, text) {
  const mailOptions = {
    from: 'ankita.m.jha01@gmail.com',
    to,
    subject,
    text
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.error('❌ Email failed:', error);
    } else {
      console.log('✅ Email sent:', info.response);
    }
  });
}

module.exports = sendEmail;
