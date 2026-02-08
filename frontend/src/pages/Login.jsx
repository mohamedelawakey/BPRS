import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { validateLoginForm } from '../utils/validators';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/app');
        }
    }, [isAuthenticated, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validation = validateLoginForm(formData);

        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const result = await login(formData.email, formData.password);

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
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
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

                <div className="login-content">
                    <div className="login-form-section">
                        <div className="form-header">
                            <h1>Welcome Back!</h1>
                            <p>Log in to continue finding your perfect programming books</p>
                        </div>

                        <form onSubmit={handleSubmit} className="login-form">
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
                                    autoFocus
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
                                        placeholder="Enter your password"
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
                            </div>

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

                            <button type="submit" className="btn-submit" disabled={isLoading}>
                                {isLoading ? 'Logging in...' : 'Log In'}
                                {!isLoading && (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                )}
                            </button>
                        </form>

                        <div className="login-footer">
                            <p>
                                Don't have an account? <Link to="/signup">Sign up for free</Link>
                            </p>
                        </div>
                    </div>

                    <div className="login-illustration">
                        <div className="illustration-content">
                            <h3>Your Reading Journey Awaits</h3>
                            <p>Access your personalized book recommendations and favorites across all your devices</p>
                            <div className="illustration-icon">📚</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
