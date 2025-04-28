const express = require('express');
const router = express.Router();
const { sendGeneralEmail, sendCourseShareEmail } = require('../utils/email');

// POST /api/email/send
router.post('/send', async (req, res) => {
  const { toEmail, subject, message, senderName, senderRole, recipientEmail, recipientName, type, courseDetails } = req.body;

  // Validate required fields for general email
  if (!toEmail || !subject || !senderName || !senderRole || !recipientEmail) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    if (type === 'course-share') {
      // Validate courseDetails for course-share type
      if (!courseDetails || !message) {
        return res.status(400).json({ error: 'courseDetails and message are required for course-share type' });
      }
      await sendCourseShareEmail(toEmail, subject, courseDetails, senderName, senderRole, recipientEmail, recipientName);
    } else {
      // Validate message for general email
      if (!message) {
        return res.status(400).json({ error: 'Message is required for general email' });
      }
      await sendGeneralEmail(toEmail, subject, message, senderName, senderRole, recipientEmail, recipientName);
    }
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

module.exports = router;