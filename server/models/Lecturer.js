const mongoose = require('mongoose');

const lecturerSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    courses: [{
        type: String,
        required: true
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Lecturer', lecturerSchema);
