document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const messageElement = document.getElementById('message');

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        
        if (!email || !password) {
            showMessage('Please fill in all fields.', 'error');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(user => user.email === email);

        if (userExists) {
            showMessage('This email is already registered.', 'error');
        } else {
            users.push({ email, password });
            localStorage.setItem('users', JSON.stringify(users));
            showMessage('Sign up successful! Redirecting to login...', 'success');
            setTimeout(() => { window.location.href = 'login.html'; }, 2000);
        }
    });

    function showMessage(message, type) {
        messageElement.textContent = message;
        messageElement.className = `message ${type}`;
        messageElement.style.display = 'block';
    }
});