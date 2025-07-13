interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
}

const signupForm = document.getElementById('signupForm') as HTMLFormElement | null;
const signupMessage = document.getElementById('signupMessage') as HTMLElement | null;

if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const name = (document.getElementById('name') as HTMLInputElement).value.trim();
        const email = (document.getElementById('email') as HTMLInputElement).value.trim();
        const password = (document.getElementById('password') as HTMLInputElement).value;

        // Check if user already exists
        try {
            const res = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(email)}`);
            const users: User[] = await res.json();
            if (users.length > 0) {
                showMessage('Email already registered.', 'danger');
                return;
            }
        } catch (err) {
            showMessage('Error connecting to server.', 'danger');
            return;
        }

        // Register new user
        const user: User = { name, email, password };
        try {
            const res = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
            if (res.ok) {
                const savedUser = await res.json();
                // Save user to localStorage for authentication
                localStorage.setItem('user', JSON.stringify(savedUser));
                showMessage('Sign up successful! Redirecting to home...', 'success');
                // Immediate redirect without setTimeout
                console.log('Registration successful, redirecting immediately...');
                window.location.href = './home.html';
            } else {
                showMessage('Sign up failed. Try again.', 'danger');
            }
        } catch (err) {
            showMessage('Error connecting to server.', 'danger');
        }
    });
}

function validateForm(): boolean {
    let valid = true;
    const name = document.getElementById('name') as HTMLInputElement;
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const confirmPassword = document.getElementById('confirmPassword') as HTMLInputElement;

    // Name
    if (!name.value.trim()) {
        name.classList.add('is-invalid');
        valid = false;
    } else {
        name.classList.remove('is-invalid');
    }
    // Email
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim())) {
        email.classList.add('is-invalid');
        valid = false;
    } else {
        email.classList.remove('is-invalid');
    }
    // Password
    if (password.value.length < 6) {
        password.classList.add('is-invalid');
        valid = false;
    } else {
        password.classList.remove('is-invalid');
    }
    // Confirm Password
    if (confirmPassword.value !== password.value || !confirmPassword.value) {
        confirmPassword.classList.add('is-invalid');
        valid = false;
    } else {
        confirmPassword.classList.remove('is-invalid');
    }
    return valid;
}

function showMessage(message: string, type: 'success' | 'danger') {
    if (signupMessage) {
        signupMessage.innerHTML = `<div class="alert alert-${type} py-2 mb-0">${message}</div>`;
    }
}
