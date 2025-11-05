// Check authentication
function requireAuth() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'login.html';
        return null;
    }
    return JSON.parse(currentUser);
}

// Initialize
const currentUser = requireAuth();
const courseSelections = JSON.parse(sessionStorage.getItem('courseSelections') || '[]');

if (!currentUser) {
    // Redirected to login
} else if (courseSelections.length === 0) {
    // No selections, redirect to courses page
    window.location.href = 'courses.html';
} else {
    // Display summary
    const summaryContent = document.getElementById('summary-content');

    summaryContent.innerHTML = `
        <p><strong>Full Name:</strong> ${currentUser.firstName} ${currentUser.lastName}</p>
        <p><strong>Student ID:</strong> ${currentUser.idNumber}</p>
        <p><strong>Email:</strong> ${currentUser.email}</p>
        <h3>Selected Courses (${courseSelections.length})</h3>
        <ul>
            ${courseSelections.map(s => `
                <li>
                    <strong>${s.courseName}</strong>
                    <span style="color: var(--text-secondary);">Taught by ${s.lecturerName}</span>
                </li>
            `).join('')}
        </ul>
    `;

    // Back to courses button
    const backToCoursesBtn = document.getElementById('back-to-courses-btn');
    if (backToCoursesBtn) {
        backToCoursesBtn.addEventListener('click', () => {
            window.location.href = 'courses.html';
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('currentUser');
            sessionStorage.removeItem('courseSelections');
            window.location.href = 'login.html';
        });
    }
}
