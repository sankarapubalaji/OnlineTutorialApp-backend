const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const { sendGeneralEmail } = require('../utils/email');

// POST: Create a new quiz and send email to assigned students
router.post('/', async (req, res) => {
  const { title, dueDate, duration, description, quizUrl, createdBy, assignedStudents } = req.body;

  if (!title || !dueDate || !duration || !description || !quizUrl || !createdBy || !assignedStudents) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const quiz = new Quiz({
      title,
      dueDate,
      duration,
      description,
      quizUrl,
      createdBy,
      assignedStudents,
    });
    await quiz.save();

    // Send email to each assigned student
    const students = assignedStudents.map(studentId => ({ id: studentId })); // Simplified for email sending
    for (const student of students) {
      const subject = `New Quiz Assigned: ${title}`;
      const message = `
Quiz Title: ${title}
Due Date: ${dueDate}
Duration: ${duration} minutes
Description: ${description}
Quiz URL: ${quizUrl}

Please complete the quiz by the due date.
      `.trim();
      await sendGeneralEmail(
        student.email || 'placeholder@example.com', // Email would be fetched in a real scenario
        subject,
        message,
        'Teacher Name', // Sender name (should be fetched from user)
        'teacher',
        'teacher@example.com', // Sender email (should be fetched)
        'Student Name' // Recipient name (should be fetched)
      );
    }

    res.status(201).json(quiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

// GET: Fetch quizzes created by a teacher or assigned to a student
router.get('/', async (req, res) => {
  const { userId, role } = req.query;

  try {
    let quizzes;
    if (role === 'teacher') {
      quizzes = await Quiz.find({ createdBy: userId }).populate('assignedStudents', 'name');
    } else {
      quizzes = await Quiz.find({ assignedStudents: userId });
    }
    res.status(200).json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

module.exports = router;