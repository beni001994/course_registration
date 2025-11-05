const mongoose = require('mongoose');
require('dotenv').config();
const Course = require('./models/Course');
const Lecturer = require('./models/Lecturer');

// Course and Lecturer data
const coursesData = [
    { id: 'CS101', name: 'Introduction to Computer Science' },
    { id: 'CS202', name: 'Data Structures and Algorithms' },
    { id: 'CS303', name: 'Database Management Systems' },
    { id: 'CS404', name: 'Software Engineering' },
    { id: 'CS505', name: 'Artificial Intelligence' },
    { id: 'MA201', name: 'Calculus II' },
    { id: 'MA301', name: 'Linear Algebra' },
    { id: 'PHY101', name: 'General Physics I' },
    { id: 'ENG202', name: 'Technical Writing' },
    { id: 'BUS301', name: 'Business Analytics' },
];

const lecturersData = [
    // Computer Science courses
    { id: 1, name: 'Dr. Sarah Smith', courses: ['CS101', 'CS202'] },
    { id: 2, name: 'Prof. Michael Johnson', courses: ['CS101', 'CS303'] },
    { id: 3, name: 'Dr. Emily Chen', courses: ['CS101', 'CS404'] },
    { id: 4, name: 'Prof. David Brown', courses: ['CS202', 'CS303'] },
    { id: 5, name: 'Dr. James Wilson', courses: ['CS202', 'CS505'] },
    { id: 6, name: 'Prof. Lisa Anderson', courses: ['CS303', 'CS404'] },
    { id: 7, name: 'Dr. Robert Taylor', courses: ['CS404', 'CS505'] },
    { id: 8, name: 'Prof. Maria Garcia', courses: ['CS505'] },

    // Mathematics courses
    { id: 9, name: 'Dr. Thomas Williams', courses: ['MA201', 'MA301'] },
    { id: 10, name: 'Prof. Jennifer Lee', courses: ['MA201'] },
    { id: 11, name: 'Dr. Christopher Martinez', courses: ['MA201', 'MA301'] },
    { id: 12, name: 'Prof. Amanda Rodriguez', courses: ['MA301'] },

    // Physics course
    { id: 13, name: 'Dr. Daniel Thompson', courses: ['PHY101'] },
    { id: 14, name: 'Prof. Karen White', courses: ['PHY101'] },
    { id: 15, name: 'Dr. Steven Harris', courses: ['PHY101'] },

    // English course
    { id: 16, name: 'Prof. Patricia Clark', courses: ['ENG202'] },
    { id: 17, name: 'Dr. Mark Lewis', courses: ['ENG202'] },
    { id: 18, name: 'Prof. Nancy Walker', courses: ['ENG202'] },

    // Business course
    { id: 19, name: 'Dr. Richard Hall', courses: ['BUS301'] },
    { id: 20, name: 'Prof. Barbara Allen', courses: ['BUS301'] },
    { id: 21, name: 'Dr. Joseph Young', courses: ['BUS301'] },
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✓ Connected to MongoDB Atlas');

        // Clear existing data
        await Course.deleteMany({});
        await Lecturer.deleteMany({});
        console.log('✓ Cleared existing courses and lecturers');

        // Insert courses
        await Course.insertMany(coursesData);
        console.log(`✓ Inserted ${coursesData.length} courses`);

        // Insert lecturers
        await Lecturer.insertMany(lecturersData);
        console.log(`✓ Inserted ${lecturersData.length} lecturers`);

        console.log('\n✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seed function
seedDatabase();
