# USIU Course Registration System

A modern, full-stack web application for university course registration built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [How It Works](#how-it-works)
- [Code Explanation](#code-explanation)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Troubleshooting](#troubleshooting)

---

## Overview

This is a course registration system designed for United States International University (USIU). Students can:
- Create an account and log in securely
- Select up to 5 courses from a catalog of 10 courses
- Assign lecturers to each course
- View and edit their registration
- See a summary of their selections

The system prevents duplicate selections and ensures data integrity with validation rules.

---

## Features

### 🔐 Authentication
- **User Registration**: Create an account with first name, last name, student ID, email, and password
- **Secure Login**: Passwords are encrypted using bcrypt hashing
- **Session Management**: User sessions are maintained using browser sessionStorage

### 📚 Course Selection
- **Browse Courses**: View 10 available courses loaded from the database
- **Select Lecturers**: Each course has 3+ qualified lecturers to choose from
- **Smart Validation**:
  - Maximum 5 courses per student
  - Cannot select the same course twice
  - Cannot assign the same lecturer to multiple courses
  - All selections must be complete before submission

### 📊 Registration Summary
- View complete registration details
- Edit selections at any time
- See all selected courses with assigned lecturers

### 🎨 Modern UI/UX
- Clean, professional design with animations
- Responsive layout (works on mobile, tablet, and desktop)
- Toast notifications instead of browser alerts
- Smooth transitions and hover effects
- Inter font from Google Fonts

---

## Technologies Used

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework for building APIs
- **MongoDB**: NoSQL database for storing user and course data
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB
- **bcryptjs**: Library for hashing passwords securely
- **cors**: Middleware to enable Cross-Origin Resource Sharing
- **dotenv**: Loads environment variables from `.env` file

### Frontend
- **HTML5**: Structure and content
- **CSS3**: Styling with modern features (Grid, Flexbox, animations)
- **Vanilla JavaScript**: Client-side logic with ES6+ features
- **Fetch API**: Making HTTP requests to the backend

### Development Tools
- **Git**: Version control
- **npm**: Package manager
- **nodemon**: Auto-restart server during development

---

## Project Structure

```
course_registration/
├── client/                      # Frontend files
│   ├── index.html              # Landing page (redirects to login)
│   ├── login.html              # Login page
│   ├── register.html           # User registration page
│   ├── courses.html            # Course selection page
│   ├── summary.html            # Registration summary page
│   ├── style.css               # All CSS styles
│   ├── auth.js                 # Login and registration logic
│   ├── course-selection.js     # Course selection logic
│   ├── summary.js              # Summary page logic
│   ├── navbar.js               # Navigation bar logic
│   └── toast.js                # Toast notification utility
│
├── server/                      # Backend files
│   ├── models/                 # Database models (schemas)
│   │   ├── User.js             # User model with password hashing
│   │   ├── Course.js           # Course model
│   │   ├── Lecturer.js         # Lecturer model
│   │   └── Registration.js     # Student registration model
│   │
│   ├── routes/                 # API route handlers
│   │   ├── auth.js             # Authentication routes (/register, /login)
│   │   └── courses.js          # Course routes (/data, /register, /registration)
│   │
│   ├── server.js               # Main Express server
│   └── seed.js                 # Database seeding script
│
├── .env                        # Environment variables (MongoDB URI, port)
├── .gitignore                  # Files to ignore in git
├── package.json                # Project dependencies and scripts
└── README.md                   # This file
```

---

## Prerequisites

Before you begin, make sure you have the following installed:

1. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/
   - Check installation: `node --version`

2. **npm** (comes with Node.js)
   - Check installation: `npm --version`

3. **Git** (for version control)
   - Download from: https://git-scm.com/
   - Check installation: `git --version`

4. **MongoDB Atlas Account** (free cloud database)
   - Sign up at: https://www.mongodb.com/cloud/atlas
   - Or install MongoDB locally

5. **Text Editor** (recommended: VS Code)
   - Download from: https://code.visualstudio.com/

---

## Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd course_registration
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages listed in `package.json`:
- express
- mongoose
- bcryptjs
- cors
- dotenv

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
PORT=3000
```

**Replace with your actual MongoDB connection string.**

### Step 4: Seed the Database

Populate the database with courses and lecturers:

```bash
npm run seed
```

This creates:
- 10 courses (Software Engineering, Data Structures, Web Development, etc.)
- 21 lecturers with their course assignments

---

## Running the Application

### Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

### Access the Application

Open your web browser and navigate to:

```
http://localhost:3000/client/index.html
```

Or directly to the login page:

```
http://localhost:3000/client/login.html
```

### Development Mode (Auto-restart)

If you want the server to automatically restart when you make changes:

```bash
npm run dev
```

(Note: You may need to install nodemon: `npm install --save-dev nodemon`)

---

## How It Works

### User Journey

```
1. Register → 2. Login → 3. Select Courses → 4. View Summary → 5. Edit (if needed)
```

#### 1. **Registration Process**
   - User fills out registration form
   - Frontend sends data to `/api/auth/register`
   - Backend hashes password with bcrypt
   - User data saved to MongoDB
   - Success toast notification displayed
   - Redirects to login page

#### 2. **Login Process**
   - User enters email and password
   - Frontend sends credentials to `/api/auth/login`
   - Backend compares hashed passwords
   - If valid, user data stored in sessionStorage
   - Success toast notification displayed
   - Redirects to course selection page

#### 3. **Course Selection**
   - Frontend fetches courses/lecturers from `/api/courses/data`
   - User can add up to 5 courses
   - When course is selected, corresponding lecturers are shown
   - Validation runs on form submission:
     - All fields must be filled
     - No duplicate courses
     - No duplicate lecturers
   - Data sent to `/api/courses/register`
   - Saved to MongoDB
   - Redirects to summary page

#### 4. **View Summary**
   - Displays user information
   - Shows all selected courses with lecturers
   - Option to edit (go back to courses page)
   - Option to logout

---

## Code Explanation

### Backend Deep Dive

#### **server/server.js**
This is the main server file that:
- Imports required modules (express, mongoose, cors, dotenv)
- Connects to MongoDB using the connection string from `.env`
- Sets up middleware:
  - `cors()`: Allows frontend to communicate with backend
  - `express.json()`: Parses incoming JSON data
- Registers route handlers:
  - `/api/auth`: Authentication routes
  - `/api/courses`: Course-related routes
- Starts the server on specified port (default 3000)

```javascript
// Example from server.js
const express = require('express');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
```

#### **server/models/User.js**
Defines the User schema and handles password encryption:
- **Schema fields**: firstName, lastName, idNumber, email, password
- **Pre-save hook**: Automatically hashes password before saving to database
- **comparePassword method**: Compares entered password with hashed password

```javascript
// Password is automatically hashed before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
```

#### **server/routes/auth.js**
Handles authentication API endpoints:
- **POST /api/auth/register**: Creates new user account
  - Validates required fields
  - Checks if email already exists
  - Saves user (password auto-hashed by User model)
  - Returns success/error response

- **POST /api/auth/login**: Authenticates user
  - Finds user by email
  - Compares password using bcrypt
  - Returns user data (without password) if valid

#### **server/routes/courses.js**
Handles course-related API endpoints:
- **GET /api/courses/data**: Returns all courses and lecturers
- **POST /api/courses/register**: Saves course selections
  - Creates or updates Registration document
  - Links to user via userId
- **GET /api/courses/registration/:userId**: Gets user's existing registration

### Frontend Deep Dive

#### **client/auth.js**
Handles registration and login forms:
- Listens for form submissions
- Collects form data
- Sends POST request to backend using fetch API
- Handles success/error responses
- Stores user data in sessionStorage
- Shows toast notifications
- Redirects to appropriate page

```javascript
// Example: Login request
const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
});
```

#### **client/course-selection.js**
Core course selection logic:

1. **Authentication Check**: Redirects to login if not logged in
2. **Data Loading**: Fetches courses and lecturers from API
3. **Dynamic UI**: Creates course entry elements dynamically
4. **Cascade Dropdowns**: Updates lecturer dropdown based on selected course
5. **Validation**: Checks for duplicates and completeness
6. **Form Submission**: Saves selections to database

Key functions:
- `fetchCoursesAndLecturers()`: Gets data from API
- `addCourseEntry()`: Creates a new course selection row
- `loadExistingSelections()`: Pre-fills form with saved selections

```javascript
// Example: Filtering lecturers by course
courseSelect.addEventListener('change', () => {
    const courseId = courseSelect.value;
    const availableLecturers = lecturers.filter(l =>
        l.courses.includes(courseId)
    );
    // Populate lecturer dropdown
});
```

#### **client/toast.js**
Toast notification system:
- Creates a container for notifications
- `showToast(message, type, duration)`: Displays a notification
- Convenience methods: `toast.success()`, `toast.error()`, etc.
- Auto-dismiss after specified duration
- Slide-in/slide-out animations

#### **client/navbar.js**
Dynamic navigation bar:
- Shows different links based on login status
- Logged out: Only shows empty nav
- Logged in: Shows "Courses" and "Summary" links
- Displays user name and logout button

#### **client/style.css**
Modern, responsive styling:
- CSS variables for theming (colors, spacing)
- Flexbox and Grid layouts
- Animations (@keyframes)
- Media queries for responsive design
- Gradient backgrounds
- Toast notification styles

---

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "idNumber": "123456",
    "email": "john.doe@usiu.ac.ke",
    "password": "securePassword123"
}
```

**Response (Success - 201):**
```json
{
    "message": "User registered successfully",
    "userId": "64a5b2c3d4e5f6g7h8i9j0k1"
}
```

**Response (Error - 400):**
```json
{
    "error": "Email already exists"
}
```

---

#### POST `/api/auth/login`
Authenticate a user.

**Request Body:**
```json
{
    "email": "john.doe@usiu.ac.ke",
    "password": "securePassword123"
}
```

**Response (Success - 200):**
```json
{
    "message": "Login successful",
    "user": {
        "id": "64a5b2c3d4e5f6g7h8i9j0k1",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@usiu.ac.ke",
        "idNumber": "123456"
    }
}
```

**Response (Error - 401):**
```json
{
    "error": "Invalid credentials"
}
```

---

### Course Endpoints

#### GET `/api/courses/data`
Get all courses and lecturers.

**Response (200):**
```json
{
    "courses": [
        { "id": "CS101", "name": "Software Engineering Principles" },
        { "id": "CS102", "name": "Data Structures and Algorithms" }
    ],
    "lecturers": [
        {
            "id": "L001",
            "name": "Dr. Sarah Johnson",
            "courses": ["CS101", "CS102"]
        }
    ]
}
```

---

#### POST `/api/courses/register`
Save course selections.

**Request Body:**
```json
{
    "userId": "64a5b2c3d4e5f6g7h8i9j0k1",
    "courseSelections": [
        {
            "courseId": "CS101",
            "courseName": "Software Engineering Principles",
            "lecturerId": "L001",
            "lecturerName": "Dr. Sarah Johnson"
        }
    ]
}
```

**Response (Success - 200):**
```json
{
    "message": "Course registration saved successfully",
    "registration": { }
}
```

---

#### GET `/api/courses/registration/:userId`
Get a user's existing registration.

**Response (200):**
```json
{
    "registration": {
        "userId": "64a5b2c3d4e5f6g7h8i9j0k1",
        "courses": [
            {
                "courseId": "CS101",
                "courseName": "Software Engineering Principles",
                "lecturerId": "L001",
                "lecturerName": "Dr. Sarah Johnson"
            }
        ]
    }
}
```

**Response (404):**
```json
{
    "message": "No registration found"
}
```

---

## Database Schema

### User Collection
```javascript
{
    _id: ObjectId,
    firstName: String (required),
    lastName: String (required),
    idNumber: String (required, unique),
    email: String (required, unique),
    password: String (required, hashed),
    createdAt: Date,
    updatedAt: Date
}
```

### Course Collection
```javascript
{
    _id: ObjectId,
    id: String (required, unique), // e.g., "CS101"
    name: String (required), // e.g., "Software Engineering Principles"
    createdAt: Date,
    updatedAt: Date
}
```

### Lecturer Collection
```javascript
{
    _id: ObjectId,
    id: String (required, unique), // e.g., "L001"
    name: String (required), // e.g., "Dr. Sarah Johnson"
    courses: [String] (required), // e.g., ["CS101", "CS102"]
    createdAt: Date,
    updatedAt: Date
}
```

### Registration Collection
```javascript
{
    _id: ObjectId,
    userId: String (required, unique, references User),
    courses: [
        {
            courseId: String (required),
            courseName: String (required),
            lecturerId: String (required),
            lecturerName: String (required)
        }
    ],
    createdAt: Date,
    updatedAt: Date
}
```

---

## Troubleshooting

### Common Issues

#### 1. **MongoDB Connection Error**
**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**
- Check that your MongoDB URI in `.env` is correct
- Verify your internet connection
- Make sure MongoDB Atlas IP whitelist includes your IP (or use 0.0.0.0/0 for development)
- Check that your database user has proper permissions

---

#### 2. **Port Already in Use**
**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
- Another application is using port 3000
- Change the PORT in `.env` file (e.g., `PORT=3001`)
- Or kill the process using port 3000:
  ```bash
  # On Linux/Mac
  lsof -ti:3000 | xargs kill -9

  # On Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```

---

#### 3. **CORS Error**
**Error:** `Access to fetch has been blocked by CORS policy`

**Solution:**
- Make sure the backend server is running
- Verify cors middleware is enabled in `server.js`
- Check that frontend is making requests to correct URL (http://localhost:3000/api/...)

---

#### 4. **Login/Register Not Working**
**Symptoms:** Form submits but nothing happens

**Solution:**
- Open browser developer tools (F12)
- Check Console tab for JavaScript errors
- Check Network tab to see if requests are being sent
- Verify backend server is running
- Check backend logs for error messages

---

#### 5. **Toast Notifications Not Showing**
**Symptoms:** No feedback after actions

**Solution:**
- Make sure `toast.js` is loaded before other scripts
- Check browser console for JavaScript errors
- Verify toast.js is included in HTML: `<script src="toast.js"></script>`
- Check that CSS for toasts is present in style.css

---

#### 6. **Courses Not Loading**
**Symptoms:** Course dropdown is empty

**Solution:**
- Make sure you ran the seed script: `npm run seed`
- Check backend logs for database errors
- Verify MongoDB connection is successful
- Open browser Network tab and check `/api/courses/data` response

---

### Development Tips

1. **Enable Server Logging**
   - Check server console for request logs
   - Add `console.log()` statements to debug issues

2. **Use Browser DevTools**
   - **Console**: See JavaScript errors and logs
   - **Network**: Monitor API requests/responses
   - **Application**: View sessionStorage data
   - **Elements**: Inspect HTML/CSS

3. **Test API with Postman/Insomnia**
   - Install Postman or Insomnia
   - Test API endpoints directly
   - Verify responses match expected format

4. **Check sessionStorage**
   - Open DevTools → Application → Session Storage
   - Look for `currentUser` and `courseSelections`
   - Verify data is being stored correctly

---

## Available Courses

The system includes 10 courses:

1. **CS101** - Software Engineering Principles
2. **CS102** - Data Structures and Algorithms
3. **CS103** - Web Development Fundamentals
4. **CS104** - Database Management Systems
5. **CS105** - Operating Systems
6. **CS106** - Computer Networks
7. **CS107** - Mobile Application Development
8. **CS108** - Artificial Intelligence
9. **CS109** - Cybersecurity Fundamentals
10. **CS110** - Cloud Computing

---

## Available Lecturers

The system includes 21 lecturers (each course has 3+ lecturers):

- Dr. Sarah Johnson
- Prof. Michael Chen
- Dr. Emily Rodriguez
- Prof. David Williams
- Dr. Lisa Anderson
- Prof. James Taylor
- Dr. Maria Garcia
- Prof. Robert Brown
- Dr. Jennifer Lee
- Prof. William Martinez
- Dr. Amanda White
- Prof. Christopher Davis
- Dr. Jessica Wilson
- Prof. Daniel Moore
- Dr. Michelle Thomas
- Prof. Andrew Jackson
- Dr. Karen Miller
- Prof. Steven Harris
- Dr. Laura Martin
- Prof. Kevin Thompson
- Dr. Rebecca Clark

---

## Security Features

- **Password Hashing**: All passwords encrypted with bcryptjs (10 salt rounds)
- **Input Validation**: Both client-side and server-side validation
- **CORS Protection**: Controlled cross-origin access
- **Environment Variables**: Sensitive data stored in .env file
- **Session Management**: Secure client-side session handling

---

## Assignment Context

### Assignment 2 - SWE 4070
**School of Science and Technology**
**United States International University**

### Assignment Transition (Assignment 1 → Assignment 2)
**Changes Made:**
1. Replaced localStorage with MongoDB database
2. Created Node.js/Express backend server
3. Implemented RESTful API architecture
4. Added password hashing for security
5. Updated frontend to use fetch API calls
6. Redesigned UI with modern, professional interface
7. Separated concerns into multiple HTML pages
8. Added toast notifications
9. Implemented navigation bar and footer
10. Expanded course catalog to 10 courses
11. Added 3+ lecturers per course
12. Moved all data to database with seed script

---

## Contributing

If you'd like to contribute to this project:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Contact

For questions or support, contact:
- **Email**: support@usiu.ac.ke
- **Website**: https://www.usiu.ac.ke

---

## Acknowledgments

- United States International University (USIU)
- School of Science and Technology
- SWE 4070 Course Instructors
- All contributors to this project
- Open source libraries and communities

---

**Built with ❤️ for USIU Students**
