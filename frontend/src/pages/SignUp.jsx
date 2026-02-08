import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { validateSignUpForm } from '../utils/validators';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import InterestsSelector from '../components/InterestsSelector';
import './SignUp.css';

function SignUp() {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [step, setStep] = useState(1); // 1: Basic Info, 2: Interests
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        interests: []
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleInterestsChange = (interests) => {
        setFormData(prev => ({ ...prev, interests }));
        if (errors.interests) {
            setErrors(prev => ({ ...prev, interests: '' }));
        }
    };

    const handleNextStep = () => {
        // Validate basic info before moving to interests
        const validation = validateSignUpForm({ ...formData, interests: ['temp'] }); // Temp interest to skip that validation

        const basicErrors = {};
        if (validation.errors.name) basicErrors.name = validation.errors.name;
        if (validation.errors.email) basicErrors.email = validation.errors.email;
        if (validation.errors.password) basicErrors.password = validation.errors.password;
        if (validation.errors.confirmPassword) basicErrors.confirmPassword = validation.errors.confirmPassword;

        if (Object.keys(basicErrors).length > 0) {
            setErrors(basicErrors);
            return;
        }

        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validation = validateSignUpForm(formData);

        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const result = await signup(formData);

            if (result.success) {
                navigate('/app');
            } else {
                setErrors({ submit: result.error });
            }
        } catch (err) {
            setErrors({ submit: 'An error occurred. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <div className="signup-header">
                    <Link to="/" className="back-link">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M5 12l7-7M5 12l7 7" />
                        </svg>
                        Back to Home
                    </Link>

                    <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        <img src="/logo.png" alt="BPRS Logo" style={{ height: '50px', width: 'auto' }} />
                    </div>
                </div>

                <div className="signup-content">
                    <div className="signup-form-section">
                        <div className="form-header">
                            <h1>Create Your Account</h1>
                            <p>Join thousands of developers finding their perfect programming books</p>
                        </div>

                        {/* Progress Indicator */}
                        <div className="progress-steps">
                            <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                                <div className="step-number">{step > 1 ? '✓' : '1'}</div>
                                <div className="step-label">Basic Info</div>
                            </div>
                            <div className="progress-line"></div>
                            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                                <div className="step-number">2</div>
                                <div className="step-label">Your Interests</div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="signup-form">
                            {step === 1 ? (
                                <div className="form-step">
                                    <div className="form-group">
                                        <label htmlFor="name">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="John Doe"
                                            className={errors.name ? 'error' : ''}
                                        />
                                        {errors.name && <span className="error-message">{errors.name}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="john@example.com"
                                            className={errors.email ? 'error' : ''}
                                        />
                                        {errors.email && <span className="error-message">{errors.email}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="password">Password</label>
                                        <div className="password-input-wrapper">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder="Create a strong password"
                                                className={errors.password ? 'error' : ''}
                                            />
                                            <button
                                                type="button"
                                                className="toggle-password"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? '👁️' : '👁️‍🗨️'}
                                            </button>
                                        </div>
                                        {errors.password && <span className="error-message">{errors.password}</span>}
                                        <PasswordStrengthMeter password={formData.password} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="confirmPassword">Confirm Password</label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            placeholder="Re-enter your password"
                                            className={errors.confirmPassword ? 'error' : ''}
                                        />
                                        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                                    </div>

                                    <button type="button" onClick={handleNextStep} className="btn-next">
                                        Continue to Interests
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div className="form-step">
                                    <div className="form-group">
                                        <label>Select Your Programming Interests</label>
                                        <p className="help-text">
                                            Choose the topics you're most interested in. This helps us recommend the perfect books for you!
                                        </p>
                                        <InterestsSelector
                                            selected={formData.interests}
                                            onChange={handleInterestsChange}
                                        />
                                        {errors.interests && <span className="error-message">{errors.interests}</span>}
                                    </div>

                                    <div className="form-actions">
                                        <button type="button" onClick={() => setStep(1)} className="btn-back">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M19 12H5M5 12l7-7M5 12l7 7" />
                                            </svg>
                                            Back
                                        </button>

                                        <button type="submit" className="btn-submit" disabled={isLoading}>
                                            {isLoading ? 'Creating Account...' : 'Create Account'}
                                            {!isLoading && (
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {errors.submit && (
                                <div className="submit-error">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    {errors.submit}
                                </div>
                            )}
                        </form>

                        <div className="signup-footer">
                            <p>
                                Already have an account? <Link to="/login">Log in</Link>
                            </p>
                        </div>
                    </div>

                    <div className="signup-benefits">
                        <h3>What you'll get:</h3>
                        <ul className="benefits-list">
                            <li>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                <span>Unlimited book searches</span>
                            </li>
                            <li>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                <span>Personalized recommendations</span>
                            </li>
                            <li>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                <span>Save your favorites</span>
                            </li>
                            <li>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                <span>Build your reading list</span>
                            </li>
                            <li>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                <span>Track your learning journey</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
