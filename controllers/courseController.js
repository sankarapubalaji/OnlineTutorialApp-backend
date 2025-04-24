const Course = require('../models/Course');

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

exports.addCourse = async (req, res) => {
  try {
    const { title, instructor, category, duration, level, image, description, courseUrl } = req.body;

    if (!title || !instructor || !image || !description || !courseUrl) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const newCourse = new Course({
      title,
      instructor,
      category,
      duration,
      level,
      image,
      description,
      courseUrl
    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Error adding course', error: error.message });
  }
};