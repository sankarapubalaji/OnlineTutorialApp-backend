const express = require('express');
const router = express.Router();
const { sendGeneralEmail } = require('../utils/email');

// POST /api/email/send
router.post('/send', async (req, res) => {
  const { toEmail, subject, message, senderName, senderRole, recipientEmail, recipientName } = req.body;

  // Validate required fields
  if (!toEmail || !subject || !message || !senderName || !senderRole || !recipientEmail || !recipientName) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Call the sendGeneralEmail function with the provided data
    await sendGeneralEmail(toEmail, subject, message, senderName, senderRole, recipientEmail, recipientName);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

module.exports = router;