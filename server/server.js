const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✓ Connected to MongoDB Atlas'))
    .catch(err => {
        console.error('✗ MongoDB connection error:', err);
        process.exit(1);
    });

// Import routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
});
