document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageElement = document.getElementById('message');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
            showMessage('Please fill in all fields.', 'error');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const validUser = users.find(user => user.email === email && user.password === password);

        if (validUser) {
            showMessage('Login successful! Redirecting...', 'success');
            sessionStorage.setItem('loggedInUser', email);
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
        } else {
            showMessage('Invalid email or password.', 'error');
        }
    });

    function showMessage(message, type) {
        messageElement.textContent = message;
        messageElement.className = `message ${type}`;
        messageElement.style.display = 'block';
    }
});