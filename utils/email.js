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

const sendGeneralEmail = async (toEmail, subject, message, senderName, senderRole, recipientEmail, recipientName) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Determine the role-based message
  const roleMessage = senderRole === 'teacher' ? 'New message from teacher' : 'New message from student';
  
  // Fallback for empty or undefined message
  const safeMessage = message && message.trim() !== '' ? message : 'No message content provided.';
  
  // Fallback for recipientName
  console.log(recipientName);
  const safeRecipientName = recipientName && recipientName.trim() !== '' ? recipientName : 'user';

  // Create the email template
  const mailOptions = {
    from: `"${senderName}" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333;">${roleMessage}</h2>
        <p style="color: #555;">Dear ${safeRecipientName},</p>
        <p style="color: #555;">You have received a new message from ${senderName} (${senderRole}):</p>
        <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; color: #333;">${safeMessage}</p>
        <p style="color: #555;">You can reach out to them at: <a href="mailto:${recipientEmail}" style="color: #3b82f6;">${recipientEmail}</a></p>
        <p style="color: #555;">Best regards,</p>
        <p style="color: #555;">Tutorial Platform Team</p>
      </div>
    `,
    text: `New message from ${senderRole}\n\nDear ${safeRecipientName},\n\nYou have received a new message from ${senderName} (${senderRole}):\n\n${safeMessage}\n\nYou can reach out to them at: ${recipientEmail}\n\nBest regards,\nTutorial Platform Team`,
  };


  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to', toEmail);
  } catch (error) {
    console.error('Failed to send email:', error.message, error.stack);
    throw error;
  }
};

module.exports = { sendVerificationEmail, sendGeneralEmail };