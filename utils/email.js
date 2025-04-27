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

const sendQuizEmail = async (toEmail, subject, quizDetails, senderName, senderRole, recipientEmail, recipientName) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Fallback for recipientName
  const safeRecipientName = recipientName && recipientName.trim() !== '' ? recipientName : 'user';

  // Extract quiz details
  const { title, dueDate, duration, description, quizUrl } = quizDetails;

  // Create the email template with a modern, interactive design
  const mailOptions = {
    from: `"${senderName}" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: subject,
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7fa; padding: 20px; max-width: 600px; margin: 0 auto;">
        <!-- Header -->
        <div style="background-color: #3b82f6; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 600;">New Quiz Assigned</h1>
        </div>

        <!-- Main Content -->
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #1e293b; font-size: 20px; font-weight: 600; margin-top: 0;">Hello, ${safeRecipientName}!</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            You have a new quiz assigned by <strong>${senderName}</strong> (${senderRole}).
          </p>

          <!-- Quiz Details -->
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <h3 style="color: #1e293b; font-size: 18px; font-weight: 600; margin-top: 0;">${title}</h3>
            <table style="width: 100%; font-size: 15px; color: #475569; margin: 10px 0;">
              <tr>
                <td style="padding: 5px 0; font-weight: 500;">Due Date:</td>
                <td style="padding: 5px 0;">${dueDate}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-weight: 500;">Duration:</td>
                <td style="padding: 5px 0;">${duration} minutes</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-weight: 500;">Description:</td>
                <td style="padding: 5px 0;">${description}</td>
              </tr>
            </table>

            <!-- Call to Action Button -->
            <div style="text-align: center; margin-top: 20px;">
              <a href="${quizUrl}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 6px; transition: background-color 0.3s ease;">
                Take Quiz Now
              </a>
            </div>
            <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 10px;">
              Or copy this link: <a href="${quizUrl}" style="color: #3b82f6; text-decoration: none;">${quizUrl}</a>
            </p>
          </div>

          <!-- Contact Info -->
          <p style="color: #475569; font-size: 14px; margin-top: 20px;">
            Need help? Reach out to ${senderName} at: 
            <a href="mailto:${recipientEmail}" style="color: #3b82f6; text-decoration: none;">${recipientEmail}</a>
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 15px; margin-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 14px; margin: 0;">
            Best regards, <br />
            <span style="font-weight: 500; color: #1e293b;">Tutorial Platform Team</span>
          </p>
        </div>
      </div>
    `,
    text: `New Quiz Assigned\n\nDear ${safeRecipientName},\n\nYou have a new quiz assigned by ${senderName} (${senderRole}):\n\nQuiz Title: ${title}\nDue Date: ${dueDate}\nDuration: ${duration} minutes\nDescription: ${description}\nQuiz URL: ${quizUrl}\n\nPlease complete the quiz by the due date.\n\nYou can reach out to them at: ${recipientEmail}\n\nBest regards,\nTutorial Platform Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Quiz email sent successfully to', toEmail);
  } catch (error) {
    console.error('Failed to send quiz email:', error.message, error.stack);
    throw error;
  }
};

module.exports = { sendVerificationEmail, sendGeneralEmail, sendQuizEmail };