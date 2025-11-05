// API base URL
const API_URL = 'http://localhost:3000/api';

// Check if user is already logged in
function checkAuth() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
        window.location.href = 'courses.html';
    }
}

// Registration Form Handler
const registrationForm = document.getElementById('registration-form');
if (registrationForm) {
    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userData = {
            firstName: document.getElementById('reg-firstname').value.trim(),
            lastName: document.getElementById('reg-lastname').value.trim(),
            idNumber: document.getElementById('reg-idnumber').value.trim(),
            email: document.getElementById('reg-email').value.trim(),
            password: document.getElementById('reg-password').value
        };

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Registration successful! Please log in.');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            } else {
                toast.error(data.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('Error connecting to server. Please try again.');
        }
    });
}

// Login Form Handler
const loginForm = document.getElementById('login-form');
if (loginForm) {
    // Check if already logged in
    checkAuth();

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const credentials = {
            email: document.getElementById('login-email').value.trim(),
            password: document.getElementById('login-password').value
        };

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (response.ok) {
                // Store user data in sessionStorage
                sessionStorage.setItem('currentUser', JSON.stringify(data.user));
                toast.success('Login successful! Redirecting...');
                // Redirect to course selection
                setTimeout(() => {
                    window.location.href = 'courses.html';
                }, 1000);
            } else {
                toast.error(data.error || 'Invalid email or password.');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Error connecting to server. Please try again.');
        }
    });
}
