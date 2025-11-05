// Navbar dynamic content handler
function updateNavbar() {
    const currentUser = sessionStorage.getItem('currentUser');
    const navUserName = document.getElementById('nav-user-name');
    const navLoginBtn = document.getElementById('nav-login-btn');
    const navLogoutBtn = document.getElementById('nav-logout-btn');
    const navLinks = document.getElementById('nav-links');

    if (currentUser) {
        // User is logged in
        const user = JSON.parse(currentUser);

        // Update user name
        if (navUserName) {
            navUserName.textContent = user.firstName;
            navUserName.style.display = 'inline';
        }

        // Show logout, hide login
        if (navLoginBtn) {
            navLoginBtn.style.display = 'none';
        }
        if (navLogoutBtn) {
            navLogoutBtn.style.display = 'inline-block';
            navLogoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                sessionStorage.removeItem('currentUser');
                sessionStorage.removeItem('courseSelections');
                window.location.href = 'login.html';
            });
        }

        // Add Courses and Summary links
        if (navLinks) {
            navLinks.innerHTML = `
                <a href="courses.html">Courses</a>
                <a href="summary.html">Summary</a>
            `;
        }
    } else {
        // User is not logged in
        if (navUserName) {
            navUserName.style.display = 'none';
        }
        if (navLoginBtn) {
            navLoginBtn.style.display = 'inline-block';
        }
        if (navLogoutBtn) {
            navLogoutBtn.style.display = 'none';
        }

        // No links when logged out
        if (navLinks) {
            navLinks.innerHTML = '';
        }
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', updateNavbar);
