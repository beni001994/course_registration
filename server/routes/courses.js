const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Lecturer = require('../models/Lecturer');

// Get courses and lecturers from database
router.get('/data', async (req, res) => {
    try {
        const courses = await Course.find().select('-_id -__v -createdAt -updatedAt').sort({ id: 1 });
        const lecturers = await Lecturer.find().select('-_id -__v -createdAt -updatedAt').sort({ id: 1 });
        res.json({ courses, lecturers });
    } catch (error) {
        console.error('Error fetching courses/lecturers:', error);
        res.status(500).json({ error: 'Server error fetching data' });
    }
});

// Save course registration
router.post('/register', async (req, res) => {
    try {
        const { userId, courseSelections } = req.body;

        // Validate input
        if (!userId || !courseSelections || !Array.isArray(courseSelections)) {
            return res.status(400).json({ error: 'Invalid request data' });
        }

        // Validate constraints
        if (courseSelections.length === 0) {
            return res.status(400).json({ error: 'Please select at least one course' });
        }

        if (courseSelections.length > 5) {
            return res.status(400).json({ error: 'Cannot select more than 5 courses' });
        }

        // Check for duplicate lecturers
        const lecturerIds = courseSelections.map(s => s.lecturerId);
        const uniqueLecturers = new Set(lecturerIds);
        if (uniqueLecturers.size !== lecturerIds.length) {
            return res.status(400).json({ error: 'Cannot choose the same lecturer for more than one course' });
        }

        // Find user and update their course selections
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user's courses
        user.courses = courseSelections;
        user.registrationDate = Date.now();
        await user.save();

        res.status(201).json({
            message: 'Course registration saved successfully',
            registration: {
                userId: user._id,
                courses: user.courses,
                registrationDate: user.registrationDate
            }
        });
    } catch (error) {
        console.error('Registration save error:', error);
        res.status(500).json({ error: 'Server error saving registration' });
    }
});

// Get user's registration
router.get('/registration/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select('firstName lastName idNumber email courses registrationDate');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.courses || user.courses.length === 0) {
            return res.status(404).json({ error: 'No registration found for this user' });
        }

        res.json({
            registration: {
                userId: user._id,
                courses: user.courses,
                registrationDate: user.registrationDate
            }
        });
    } catch (error) {
        console.error('Get registration error:', error);
        res.status(500).json({ error: 'Server error retrieving registration' });
    }
});

module.exports = router;
