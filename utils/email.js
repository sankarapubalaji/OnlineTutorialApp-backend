const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, name, token) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to Tutorial Platform - Verify Your Email',
    html: `
      <h2>Welcome, ${name}!</h2>
      <p>Thank you for joining our Tutorial Platform. Please verify your email to activate your account.</p>
      <a href="http://localhost:3000/verify/${token}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>If the button doesn't work, copy and paste this link: http://localhost:3000/verify/${token}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };