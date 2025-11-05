const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, idNumber, email, password } = req.body;

        // Validate input
        if (!firstName || !lastName || !idNumber || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { idNumber }] });
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ error: 'User with this email already exists' });
            }
            if (existingUser.idNumber === idNumber) {
                return res.status(400).json({ error: 'User with this ID number already exists' });
            }
        }

        // Create new user
        const user = new User({
            firstName,
            lastName,
            idNumber,
            email,
            password
        });

        await user.save();

        res.status(201).json({
            message: 'Registration successful',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                idNumber: user.idNumber,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                idNumber: user.idNumber,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

module.exports = router;
