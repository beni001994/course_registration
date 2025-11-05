// API base URL
const API_URL = 'http://localhost:3000/api';

// Global variables for courses and lecturers
let courses = [];
let lecturers = [];

// Check authentication
function requireAuth() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'login.html';
        return null;
    }
    return JSON.parse(currentUser);
}

// Fetch courses and lecturers from API
async function fetchCoursesAndLecturers() {
    try {
        const response = await fetch(`${API_URL}/courses/data`);
        if (response.ok) {
            const data = await response.json();
            courses = data.courses;
            lecturers = data.lecturers;
            console.log('✓ Loaded courses and lecturers from database');
        } else {
            console.error('Failed to fetch courses and lecturers');
            toast.error('Error loading courses. Please refresh the page.');
        }
    } catch (error) {
        console.error('Error fetching courses/lecturers:', error);
        toast.error('Error connecting to server. Please refresh the page.');
    }
}

// Initialize
const currentUser = requireAuth();
if (!currentUser) {
    // User not authenticated, redirected to login
} else {
    // First, fetch courses and lecturers from the database
    fetchCoursesAndLecturers().then(() => {
    // Display user name
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    }

    // Logout handler
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('currentUser');
            sessionStorage.removeItem('courseSelections');
            window.location.href = 'login.html';
        });
    }

    // Course selection functionality
    const courseEntries = document.getElementById('course-entries');
    const addCourseBtn = document.getElementById('add-course-btn');
    const courseSelectionForm = document.getElementById('course-selection-form');

    // Load existing selections
    async function loadExistingSelections() {
        try {
            const response = await fetch(`${API_URL}/courses/registration/${currentUser.id}`);
            if (response.ok) {
                const data = await response.json();
                if (data.registration && data.registration.courses.length > 0) {
                    // Pre-populate with existing selections
                    data.registration.courses.forEach(courseData => {
                        addCourseEntry(courseData.courseId, courseData.lecturerId);
                    });
                }
            }
        } catch (error) {
            console.log('No existing registration found or error loading:', error);
        }
    }

    // Add course entry
    addCourseBtn.addEventListener('click', () => {
        if (courseEntries.children.length >= 5) {
            toast.warning('You cannot select more than 5 courses.');
            return;
        }
        addCourseEntry();
    });

    function addCourseEntry(preSelectedCourseId = null, preSelectedLecturerId = null) {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'course-entry';

        // Create course select wrapper
        const courseGroup = document.createElement('div');
        courseGroup.className = 'input-group';
        const courseLabel = document.createElement('label');
        courseLabel.textContent = 'Course';
        const courseSelect = document.createElement('select');
        courseSelect.required = true;
        courseSelect.innerHTML = `<option value="">-- Select a Course --</option>` +
            courses.map(c => `<option value="${c.id}" ${c.id === preSelectedCourseId ? 'selected' : ''}>${c.name}</option>`).join('');

        courseGroup.appendChild(courseLabel);
        courseGroup.appendChild(courseSelect);

        // Create lecturer select wrapper
        const lecturerGroup = document.createElement('div');
        lecturerGroup.className = 'input-group';
        const lecturerLabel = document.createElement('label');
        lecturerLabel.textContent = 'Lecturer';
        const lecturerSelect = document.createElement('select');
        lecturerSelect.required = true;
        lecturerSelect.innerHTML = `<option value="">-- Select a Lecturer --</option>`;
        lecturerSelect.disabled = true;

        lecturerGroup.appendChild(lecturerLabel);
        lecturerGroup.appendChild(lecturerSelect);

        // When a course is selected, update the lecturer dropdown
        courseSelect.addEventListener('change', () => {
            const courseId = courseSelect.value;
            lecturerSelect.innerHTML = `<option value="">-- Select a Lecturer --</option>`;
            if (courseId) {
                const availableLecturers = lecturers.filter(l => l.courses.includes(courseId));
                lecturerSelect.innerHTML += availableLecturers.map(l =>
                    `<option value="${l.id}">${l.name}</option>`
                ).join('');
                lecturerSelect.disabled = false;
            } else {
                lecturerSelect.disabled = true;
            }
        });

        // Create remove button
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn-remove';
        removeBtn.textContent = '×';
        removeBtn.title = 'Remove this course';
        removeBtn.addEventListener('click', () => {
            entryDiv.remove();
        });

        entryDiv.appendChild(courseGroup);
        entryDiv.appendChild(lecturerGroup);
        entryDiv.appendChild(removeBtn);
        courseEntries.appendChild(entryDiv);

        // If pre-selected, trigger the change event to load lecturers
        if (preSelectedCourseId) {
            courseSelect.dispatchEvent(new Event('change'));
            // Set the lecturer after a brief delay to ensure lecturers are loaded
            setTimeout(() => {
                if (preSelectedLecturerId) {
                    lecturerSelect.value = preSelectedLecturerId;
                }
            }, 50);
        }
    }

    // Form submission
    courseSelectionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const selections = [];
        const selectedCourses = new Set();
        const selectedLecturers = new Set();
        const courseDivs = courseEntries.querySelectorAll('.course-entry');

        for (const div of courseDivs) {
            const selects = div.querySelectorAll('select');
            const courseSelect = selects[0];
            const lecturerSelect = selects[1];
            const courseId = courseSelect.value;
            const lecturerId = lecturerSelect.value;

            if (!courseId || !lecturerId) {
                toast.warning('Please make a complete selection for all courses.');
                return;
            }

            if (selectedCourses.has(courseId)) {
                toast.warning('You cannot select the same course more than once.');
                return;
            }
            selectedCourses.add(courseId);

            if (selectedLecturers.has(lecturerId)) {
                toast.warning('You cannot choose the same lecturer for more than one course.');
                return;
            }
            selectedLecturers.add(lecturerId);

            const course = courses.find(c => c.id === courseId);
            const lecturer = lecturers.find(l => l.id == lecturerId);

            selections.push({
                courseId: course.id,
                courseName: course.name,
                lecturerId: lecturer.id,
                lecturerName: lecturer.name
            });
        }

        if (selections.length === 0) {
            toast.warning('Please add at least one course.');
            return;
        }

        // Save to database
        try {
            const response = await fetch(`${API_URL}/courses/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: currentUser.id,
                    courseSelections: selections
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Store selections in sessionStorage for summary page
                sessionStorage.setItem('courseSelections', JSON.stringify(selections));
                toast.success('Registration saved successfully! Redirecting...');
                // Redirect to summary page
                setTimeout(() => {
                    window.location.href = 'summary.html';
                }, 1000);
            } else {
                toast.error(data.error || 'Failed to save course registration');
            }
        } catch (error) {
            console.error('Course registration error:', error);
            toast.error('Error connecting to server. Please try again.');
        }
    });

    // Load existing selections on page load
    loadExistingSelections();
    });
}
