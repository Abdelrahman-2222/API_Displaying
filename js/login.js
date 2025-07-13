"use strict";
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateLoginForm())
            return;
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        try {
            const res = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(email)}`);
            const users = await res.json();
            if (users.length === 0) {
                showLoginMessage('No account found with this email.', 'danger');
                return;
            }
            const user = users[0];
            if (user.password !== password) {
                showLoginMessage('Incorrect password.', 'danger');
                return;
            }
            // Simulate authentication (store user in localStorage)
            localStorage.setItem('user', JSON.stringify(user));
            showLoginMessage('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1200);
        }
        catch (err) {
            showLoginMessage('Error connecting to server.', 'danger');
        }
    });
}
function validateLoginForm() {
    let valid = true;
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim())) {
        email.classList.add('is-invalid');
        valid = false;
    }
    else {
        email.classList.remove('is-invalid');
    }
    if (!password.value) {
        password.classList.add('is-invalid');
        valid = false;
    }
    else {
        password.classList.remove('is-invalid');
    }
    return valid;
}
function showLoginMessage(message, type) {
    if (loginMessage) {
        loginMessage.innerHTML = `<div class="alert alert-${type} py-2 mb-0">${message}</div>`;
    }
}
