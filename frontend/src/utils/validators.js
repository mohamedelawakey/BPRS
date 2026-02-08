// Password strength validation
export const validatePasswordStrength = (password) => {
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const passed = Object.values(checks).filter(Boolean).length;

    let strength = 'weak';
    let score = 0;

    if (passed >= 5) {
        strength = 'strong';
        score = 100;
    } else if (passed >= 3) {
        strength = 'medium';
        score = 60;
    } else {
        strength = 'weak';
        score = 30;
    }

    return {
        strength,
        score,
        checks,
        isValid: passed >= 3 // At least medium strength required
    };
};

// Email validation
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Name validation
export const validateName = (name) => {
    return name.trim().length >= 2;
};

// Form validation
export const validateSignUpForm = (formData) => {
    const errors = {};

    if (!validateName(formData.name)) {
        errors.name = 'Name must be at least 2 characters';
    }

    if (!validateEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }

    const passwordCheck = validatePasswordStrength(formData.password);
    if (!passwordCheck.isValid) {
        errors.password = 'Password must be at least medium strength';
    }

    if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.interests || formData.interests.length === 0) {
        errors.interests = 'Please select at least one interest';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateLoginForm = (formData) => {
    const errors = {};

    if (!validateEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
        errors.password = 'Password is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
