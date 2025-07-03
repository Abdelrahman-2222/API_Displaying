// -- Start -- Index (Sign Up) Page
// Interface for form validation result
interface ValidationResult {
    isValid: boolean;
    message: string;
}

// Interface for form data
interface SignUpFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

class FormValidator {
    // Email validation using regex
    private static validateEmail(email: string): ValidationResult {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email.trim()) {
            return { isValid: false, message: "Email is required" };
        }
        
        if (!emailRegex.test(email)) {
            return { isValid: false, message: "Please enter a valid email address" };
        }
        
        return { isValid: true, message: "" };
    }

    // Name validation
    private static validateName(name: string): ValidationResult {
        if (!name.trim()) {
            return { isValid: false, message: "Name is required" };
        }
        
        if (name.trim().length < 2) {
            return { isValid: false, message: "Name must be at least 2 characters long" };
        }
        
        if (name.trim().length > 50) {
            return { isValid: false, message: "Name must be less than 50 characters" };
        }
        
        // Check if name contains only letters, spaces, hyphens, and apostrophes
        const nameRegex = /^[a-zA-Z\s\-']+$/;
        if (!nameRegex.test(name.trim())) {
            return { isValid: false, message: "Name can only contain letters, spaces, hyphens, and apostrophes" };
        }
        
        return { isValid: true, message: "" };
    }

    // Password validation
    private static validatePassword(password: string): ValidationResult {
        if (!password) {
            return { isValid: false, message: "Password is required" };
        }
        
        if (password.length < 8) {
            return { isValid: false, message: "Password must be at least 8 characters long" };
        }
        
        if (password.length > 128) {
            return { isValid: false, message: "Password must be less than 128 characters" };
        }
        
        // Check for at least one uppercase letter
        if (!/[A-Z]/.test(password)) {
            return { isValid: false, message: "Password must contain at least one uppercase letter" };
        }
        
        // Check for at least one lowercase letter
        if (!/[a-z]/.test(password)) {
            return { isValid: false, message: "Password must contain at least one lowercase letter" };
        }
        
        // Check for at least one number
        if (!/\d/.test(password)) {
            return { isValid: false, message: "Password must contain at least one number" };
        }
        
        // Check for at least one special character
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            return { isValid: false, message: "Password must contain at least one special character" };
        }
        
        return { isValid: true, message: "" };
    }

    // Confirm password validation
    private static validateConfirmPassword(password: string, confirmPassword: string): ValidationResult {
        if (!confirmPassword) {
            return { isValid: false, message: "Please confirm your password" };
        }
        
        if (password !== confirmPassword) {
            return { isValid: false, message: "Passwords do not match" };
        }
        
        return { isValid: true, message: "" };
    }

    // Main validation method
    public static validateForm(formData: SignUpFormData): { [key: string]: ValidationResult } {
        return {
            name: this.validateName(formData.name),
            email: this.validateEmail(formData.email),
            password: this.validatePassword(formData.password),
            confirmPassword: this.validateConfirmPassword(formData.password, formData.confirmPassword)
        };
    }
}

class SignUpForm {
    private form!: HTMLFormElement;
    private nameInput!: HTMLInputElement;
    private emailInput!: HTMLInputElement;
    private passwordInput!: HTMLInputElement;
    private confirmPasswordInput!: HTMLInputElement;

    constructor() {
        this.initializeElements();
        this.attachEventListeners();
    }

    private initializeElements(): void {
        this.form = document.getElementById('register-form') as HTMLFormElement;
        this.nameInput = document.getElementById('name') as HTMLInputElement;
        this.emailInput = document.getElementById('email') as HTMLInputElement;
        this.passwordInput = document.getElementById('pass') as HTMLInputElement;
        this.confirmPasswordInput = document.getElementById('re_pass') as HTMLInputElement;

        if (!this.form || !this.nameInput || !this.emailInput || !this.passwordInput || !this.confirmPasswordInput) {
            throw new Error('Required form elements not found');
        }
    }

    private attachEventListeners(): void {
        // Real-time validation on input
        this.nameInput.addEventListener('blur', () => this.validateField('name'));
        this.emailInput.addEventListener('blur', () => this.validateField('email'));
        this.passwordInput.addEventListener('blur', () => this.validateField('password'));
        this.confirmPasswordInput.addEventListener('blur', () => this.validateField('confirmPassword'));

        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Clear error messages on focus
        [this.nameInput, this.emailInput, this.passwordInput, this.confirmPasswordInput].forEach(input => {
            input.addEventListener('focus', () => this.clearErrorMessage(input));
        });
    }

    private validateField(fieldName: string): void {
        const formData = this.getFormData();
        const validationResults = FormValidator.validateForm(formData);
        const result = validationResults[fieldName];

        if (!result.isValid) {
            this.showErrorMessage(fieldName, result.message);
        } else {
            this.clearErrorMessage(this.getInputByFieldName(fieldName));
        }
    }

    private getFormData(): SignUpFormData {
        return {
            name: this.nameInput.value,
            email: this.emailInput.value,
            password: this.passwordInput.value,
            confirmPassword: this.confirmPasswordInput.value
        };
    }

    private getInputByFieldName(fieldName: string): HTMLInputElement {
        switch (fieldName) {
            case 'name': return this.nameInput;
            case 'email': return this.emailInput;
            case 'password': return this.passwordInput;
            case 'confirmPassword': return this.confirmPasswordInput;
            default: throw new Error(`Unknown field name: ${fieldName}`);
        }
    }

    private showErrorMessage(fieldName: string, message: string): void {
        const input = this.getInputByFieldName(fieldName);
        const formGroup = input.closest('.form-group') as HTMLElement;
        
        // Remove existing error message
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add error styling to input
        input.classList.add('error');
        input.style.borderBottomColor = '#e74c3c';

        // Create and add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            color: #e74c3c;
            font-size: 12px;
            margin-top: 5px;
            display: block;
        `;
        errorDiv.textContent = message;
        
        formGroup.appendChild(errorDiv);
    }

    private clearErrorMessage(input: HTMLInputElement): void {
        const formGroup = input.closest('.form-group') as HTMLElement;
        const errorMessage = formGroup.querySelector('.error-message');
        
        if (errorMessage) {
            errorMessage.remove();
        }
        
        input.classList.remove('error');
        input.style.borderBottomColor = '';
    }

    private handleSubmit(event: Event): void {
        event.preventDefault();
        
        const formData = this.getFormData();
        const validationResults = FormValidator.validateForm(formData);
        
        // Clear all previous errors
        [this.nameInput, this.emailInput, this.passwordInput, this.confirmPasswordInput].forEach(input => {
            this.clearErrorMessage(input);
        });

        // Check if all validations passed
        const isFormValid = Object.values(validationResults).every(result => result.isValid);
        
        if (!isFormValid) {
            // Show error messages for invalid fields
            Object.keys(validationResults).forEach(fieldName => {
                const result = validationResults[fieldName];
                if (!result.isValid) {
                    this.showErrorMessage(fieldName, result.message);
                }
            });
            
            // Focus on first error field
            const firstErrorField = Object.keys(validationResults).find(
                fieldName => !validationResults[fieldName].isValid
            );
            if (firstErrorField) {
                this.getInputByFieldName(firstErrorField).focus();
            }
            
            return;
        }

        // If all validations pass, submit the form
        this.submitForm(formData);
    }

    private submitForm(formData: SignUpFormData): void {
        // Show loading state
        const submitButton = document.getElementById('signup') as HTMLInputElement;
        const originalValue = submitButton.value;
        submitButton.value = 'Registering...';
        submitButton.disabled = true;

        // Simulate API call (replace with actual API call)
        setTimeout(() => {
            // Reset button state
            submitButton.value = originalValue;
            submitButton.disabled = false;

            // Show success message
            this.showSuccessMessage('Registration successful! Please check your email to verify your account.');
            
            // Optionally redirect to login page
            // window.location.href = 'login.html';
        }, 2000);

        // In a real application, you would make an API call here:
        // try {
        //     const response = await fetch('/api/signup', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(formData),
        //     });
        //     
        //     if (response.ok) {
        //         this.showSuccessMessage('Registration successful!');
        //         window.location.href = 'login.html';
        //     } else {
        //         const errorData = await response.json();
        //         this.showErrorMessage('email', errorData.message || 'Registration failed');
        //     }
        // } catch (error) {
        //     this.showErrorMessage('email', 'Network error. Please try again.');
        // }
    }

    private showSuccessMessage(message: string): void {
        // Remove existing success messages
        const existingSuccess = document.querySelector('.success-message');
        if (existingSuccess) {
            existingSuccess.remove();
        }

        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            text-align: center;
        `;
        successDiv.textContent = message;

        // Insert before the form
        this.form.parentNode?.insertBefore(successDiv, this.form);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
}

// Initialize the form when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the sign up page (index.html)
    if (document.getElementById('register-form')) {
        try {
            new SignUpForm();
        } catch (error) {
            console.error('Failed to initialize sign up form:', error);
        }
    }
});
// -- End -- Index (Sign Up) Page

// -- Start -- Login (Sign In) Page
// Interface for sign in form data
interface SignInFormData {
    username: string;
    password: string;
    rememberMe: boolean;
}

class SignInValidator {
    // Username validation (can be email or username)
    private static validateUsername(username: string): ValidationResult {
        if (!username.trim()) {
            return { isValid: false, message: "Username or email is required" };
        }
        
        if (username.trim().length < 3) {
            return { isValid: false, message: "Username must be at least 3 characters long" };
        }
        
        if (username.trim().length > 100) {
            return { isValid: false, message: "Username must be less than 100 characters" };
        }
        
        // Check if it's an email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
        
        if (!emailRegex.test(username) && !usernameRegex.test(username)) {
            return { isValid: false, message: "Please enter a valid username or email address" };
        }
        
        return { isValid: true, message: "" };
    }

    // Password validation for sign in (less strict than sign up)
    private static validateSignInPassword(password: string): ValidationResult {
        if (!password) {
            return { isValid: false, message: "Password is required" };
        }
        
        if (password.length < 1) {
            return { isValid: false, message: "Password cannot be empty" };
        }
        
        if (password.length > 128) {
            return { isValid: false, message: "Password is too long" };
        }
        
        return { isValid: true, message: "" };
    }

    // Main validation method for sign in
    public static validateSignInForm(formData: SignInFormData): { [key: string]: ValidationResult } {
        return {
            username: this.validateUsername(formData.username),
            password: this.validateSignInPassword(formData.password)
        };
    }
}

class SignInForm {
    private form!: HTMLFormElement;
    private usernameInput!: HTMLInputElement;
    private passwordInput!: HTMLInputElement;
    private rememberMeCheckbox!: HTMLInputElement;
    private loginAttempts: number = 0;
    private maxLoginAttempts: number = 5;
    private lockoutDuration: number = 15 * 60 * 1000; // 15 minutes in milliseconds

    constructor() {
        this.initializeElements();
        this.attachEventListeners();
        this.checkLockoutStatus();
        this.loadRememberedCredentials();
    }

    private initializeElements(): void {
        this.form = document.getElementById('login-form') as HTMLFormElement;
        this.usernameInput = document.getElementById('your_name') as HTMLInputElement;
        this.passwordInput = document.getElementById('your_pass') as HTMLInputElement;
        this.rememberMeCheckbox = document.getElementById('remember-me') as HTMLInputElement;

        if (!this.form || !this.usernameInput || !this.passwordInput || !this.rememberMeCheckbox) {
            throw new Error('Required login form elements not found');
        }
    }

    private attachEventListeners(): void {
        // Real-time validation on input
        this.usernameInput.addEventListener('blur', () => this.validateField('username'));
        this.passwordInput.addEventListener('blur', () => this.validateField('password'));

        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSignInSubmit(e));

        // Clear error messages on focus
        [this.usernameInput, this.passwordInput].forEach(input => {
            input.addEventListener('focus', () => this.clearErrorMessage(input));
        });

        // Show/hide password functionality
        this.addPasswordToggle();

        // Enter key handling
        [this.usernameInput, this.passwordInput].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.form.dispatchEvent(new Event('submit'));
                }
            });
        });
    }

    private validateField(fieldName: string): void {
        const formData = this.getSignInFormData();
        const validationResults = SignInValidator.validateSignInForm(formData);
        const result = validationResults[fieldName];

        if (!result.isValid) {
            this.showErrorMessage(fieldName, result.message);
        } else {
            this.clearErrorMessage(this.getInputByFieldName(fieldName));
        }
    }

    private getSignInFormData(): SignInFormData {
        return {
            username: this.usernameInput.value,
            password: this.passwordInput.value,
            rememberMe: this.rememberMeCheckbox.checked
        };
    }

    private getInputByFieldName(fieldName: string): HTMLInputElement {
        switch (fieldName) {
            case 'username': return this.usernameInput;
            case 'password': return this.passwordInput;
            default: throw new Error(`Unknown field name: ${fieldName}`);
        }
    }

    private showErrorMessage(fieldName: string, message: string): void {
        const input = this.getInputByFieldName(fieldName);
        const formGroup = input.closest('.form-group') as HTMLElement;
        
        // Remove existing error message
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add error styling to input
        input.classList.add('error');
        input.style.borderBottomColor = '#e74c3c';

        // Create and add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            color: #e74c3c;
            font-size: 12px;
            margin-top: 5px;
            display: block;
        `;
        errorDiv.textContent = message;
        
        formGroup.appendChild(errorDiv);
    }

    private clearErrorMessage(input: HTMLInputElement): void {
        const formGroup = input.closest('.form-group') as HTMLElement;
        const errorMessage = formGroup.querySelector('.error-message');
        
        if (errorMessage) {
            errorMessage.remove();
        }
        
        input.classList.remove('error');
        input.style.borderBottomColor = '';
    }

    private handleSignInSubmit(event: Event): void {
        event.preventDefault();
        
        // Check if account is locked out
        if (this.isLockedOut()) {
            this.showLockoutMessage();
            return;
        }
        
        const formData = this.getSignInFormData();
        const validationResults = SignInValidator.validateSignInForm(formData);
        
        // Clear all previous errors
        [this.usernameInput, this.passwordInput].forEach(input => {
            this.clearErrorMessage(input);
        });

        // Check if all validations passed
        const isFormValid = Object.values(validationResults).every(result => result.isValid);
        
        if (!isFormValid) {
            // Show error messages for invalid fields
            Object.keys(validationResults).forEach(fieldName => {
                const result = validationResults[fieldName];
                if (!result.isValid) {
                    this.showErrorMessage(fieldName, result.message);
                }
            });
            
            // Focus on first error field
            const firstErrorField = Object.keys(validationResults).find(
                fieldName => !validationResults[fieldName].isValid
            );
            if (firstErrorField) {
                this.getInputByFieldName(firstErrorField).focus();
            }
            
            return;
        }

        // If all validations pass, attempt sign in
        this.attemptSignIn(formData);
    }

    private attemptSignIn(formData: SignInFormData): void {
        // Show loading state
        const submitButton = document.getElementById('signin') as HTMLInputElement;
        const originalValue = submitButton.value;
        submitButton.value = 'Signing in...';
        submitButton.disabled = true;

        // Simulate API call (replace with actual authentication)
        setTimeout(() => {
            // Reset button state
            submitButton.value = originalValue;
            submitButton.disabled = false;

            // Simulate authentication logic
            const isAuthenticated = this.simulateAuthentication(formData);
            
            if (isAuthenticated) {
                this.handleSuccessfulSignIn(formData);
            } else {
                this.handleFailedSignIn();
            }
        }, 1500);
    }

    private simulateAuthentication(formData: SignInFormData): boolean {
        // This is a simulation - replace with real authentication
        // For demo purposes, accept any username with password "password123"
        return formData.password === "password123" || 
               (formData.username === "demo@example.com" && formData.password === "demo123");
    }

    private handleSuccessfulSignIn(formData: SignInFormData): void {
        // Reset login attempts
        this.loginAttempts = 0;
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('lockoutTime');

        // Handle remember me functionality
        if (formData.rememberMe) {
            localStorage.setItem('rememberedUsername', formData.username);
        } else {
            localStorage.removeItem('rememberedUsername');
        }

        // Store authentication token (in real app)
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('currentUser', formData.username);

        // Show success message
        this.showSuccessMessage('Login successful! Redirecting...');
        
        // Redirect to dashboard or home page
        setTimeout(() => {
            window.location.href = 'index.html'; // Replace with actual dashboard URL
        }, 1500);
    }

    private handleFailedSignIn(): void {
        this.loginAttempts++;
        localStorage.setItem('loginAttempts', this.loginAttempts.toString());
        
        const remainingAttempts = this.maxLoginAttempts - this.loginAttempts;
        
        if (this.loginAttempts >= this.maxLoginAttempts) {
            // Lock out the user
            const lockoutTime = Date.now() + this.lockoutDuration;
            localStorage.setItem('lockoutTime', lockoutTime.toString());
            this.showLockoutMessage();
        } else {
            const message = `Invalid username or password. ${remainingAttempts} attempts remaining.`;
            this.showErrorMessage('password', message);
        }
    }

    private isLockedOut(): boolean {
        const lockoutTime = localStorage.getItem('lockoutTime');
        if (!lockoutTime) return false;
        
        const lockoutExpiry = parseInt(lockoutTime);
        const now = Date.now();
        
        if (now < lockoutExpiry) {
            return true;
        } else {
            // Lockout expired, clear it
            localStorage.removeItem('lockoutTime');
            localStorage.removeItem('loginAttempts');
            this.loginAttempts = 0;
            return false;
        }
    }

    private checkLockoutStatus(): void {
        const attempts = localStorage.getItem('loginAttempts');
        if (attempts) {
            this.loginAttempts = parseInt(attempts);
        }
        
        if (this.isLockedOut()) {
            this.showLockoutMessage();
        }
    }

    private showLockoutMessage(): void {
        const lockoutTime = localStorage.getItem('lockoutTime');
        if (!lockoutTime) return;
        
        const lockoutExpiry = parseInt(lockoutTime);
        const now = Date.now();
        const remainingTime = Math.ceil((lockoutExpiry - now) / (60 * 1000)); // minutes
        
        const message = `Account temporarily locked due to too many failed attempts. Please try again in ${remainingTime} minutes.`;
        this.showFormMessage(message, 'error');
        
        // Disable form
        this.usernameInput.disabled = true;
        this.passwordInput.disabled = true;
        const submitButton = document.getElementById('signin') as HTMLInputElement;
        submitButton.disabled = true;
        
        // Set timer to re-enable form
        setTimeout(() => {
            this.usernameInput.disabled = false;
            this.passwordInput.disabled = false;
            submitButton.disabled = false;
            this.hideFormMessage();
        }, remainingTime * 60 * 1000);
    }

    private loadRememberedCredentials(): void {
        const rememberedUsername = localStorage.getItem('rememberedUsername');
        if (rememberedUsername) {
            this.usernameInput.value = rememberedUsername;
            this.rememberMeCheckbox.checked = true;
            this.passwordInput.focus();
        }
    }

    private addPasswordToggle(): void {
        const passwordGroup = this.passwordInput.closest('.form-group') as HTMLElement;
        
        // Create toggle button
        const toggleButton = document.createElement('button');
        toggleButton.type = 'button';
        toggleButton.innerHTML = '<i class="fa-solid fa-eye"></i>';
        toggleButton.style.cssText = `
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            color: #666;
        `;
        
        // Add toggle functionality
        toggleButton.addEventListener('click', () => {
            const isPassword = this.passwordInput.type === 'password';
            this.passwordInput.type = isPassword ? 'text' : 'password';
            toggleButton.innerHTML = isPassword ? 
                '<i class="fa-solid fa-eye-slash"></i>' : 
                '<i class="fa-solid fa-eye"></i>';
        });
        
        passwordGroup.style.position = 'relative';
        passwordGroup.appendChild(toggleButton);
    }

    private showSuccessMessage(message: string): void {
        this.showFormMessage(message, 'success');
    }

    private showFormMessage(message: string, type: 'success' | 'error'): void {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = 'form-message';
        
        const backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
        const borderColor = type === 'success' ? '#c3e6cb' : '#f5c6cb';
        const textColor = type === 'success' ? '#155724' : '#721c24';
        
        messageDiv.style.cssText = `
            background-color: ${backgroundColor};
            border: 1px solid ${borderColor};
            color: ${textColor};
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            text-align: center;
        `;
        messageDiv.textContent = message;

        // Insert before the form
        this.form.parentNode?.insertBefore(messageDiv, this.form);

        // Auto-remove success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }
    }

    private hideFormMessage(): void {
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }
}

// Initialize the sign in form when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the login page
    if (document.getElementById('login-form')) {
        try {
            new SignInForm();
        } catch (error) {
            console.error('Failed to initialize sign in form:', error);
        }
    }
});
// -- End -- Login (Sign In) Page

