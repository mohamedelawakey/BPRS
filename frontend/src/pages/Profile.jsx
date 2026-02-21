import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserFavorites } from '../utils/storage';
import { validatePasswordStrength } from '../utils/validators';
import Avatar from '../components/Avatar';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import InterestsSelector from '../components/InterestsSelector';
import './Profile.css';

function Profile() {
    const navigate = useNavigate();
    const { currentUser, updateCurrentUser, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('account');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [interests, setInterests] = useState(currentUser?.interests || []);
    const [errors, setErrors] = useState({});

    const favorites = getUserFavorites(currentUser?.id);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };


    const handleSaveProfile = async () => {
        setIsSaving(true);
        setErrors({});
        setSuccessMessage('');

        const updates = {};

        if (formData.name !== currentUser.name) {
            updates.name = formData.name;
        }

        if (formData.email !== currentUser.email) {
            updates.email = formData.email;
        }

        // Validate if changing password
        if (formData.newPassword) {
            const passwordCheck = validatePasswordStrength(formData.newPassword);
            if (!passwordCheck.isValid) {
                setErrors({ newPassword: 'Password must be at least medium strength' });
                setIsSaving(false);
                return;
            }

            if (formData.newPassword !== formData.confirmPassword) {
                setErrors({ confirmPassword: 'Passwords do not match' });
                setIsSaving(false);
                return;
            }

            updates.password = formData.newPassword;
        }

        const result = await updateCurrentUser(updates);

        if (result.success) {
            setSuccessMessage('Profile updated successfully!');
            setIsEditing(false);
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
            setTimeout(() => setSuccessMessage(''), 3000);
        } else {
            setErrors({ submit: result.error });
        }

        setIsSaving(false);
    };

    const handleSaveInterests = async () => {
        setIsSaving(true);
        const result = await updateCurrentUser({ interests });

        if (result.success) {
            setSuccessMessage('Interests updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }

        setIsSaving(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="profile-page">
            <div className="profile-header">
                <button onClick={() => navigate('/app')} className="back-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M5 12l7-7M5 12l7 7" />
                    </svg>
                    Back to App
                </button>

                <button onClick={handleLogout} className="logout-btn">
                    Logout
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                    </svg>
                </button>
            </div>

            <div className="profile-container">
                <div className="profile-sidebar">
                    <div className="profile-user-card">
                        <Avatar user={currentUser} size="xlarge" showStatus={true} />
                        <h3>{currentUser?.name}</h3>
                        <p>{currentUser?.email}</p>
                    </div>

                    <nav className="profile-nav">
                        <button
                            className={`nav-item ${activeTab === 'account' ? 'active' : ''}`}
                            onClick={() => setActiveTab('account')}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            Account Settings
                        </button>

                        <button
                            className={`nav-item ${activeTab === 'favorites' ? 'active' : ''}`}
                            onClick={() => setActiveTab('favorites')}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            Favorites
                            <span className="badge">{favorites.length}</span>
                        </button>

                        <button
                            className={`nav-item ${activeTab === 'interests' ? 'active' : ''}`}
                            onClick={() => setActiveTab('interests')}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </svg>
                            My Interests
                            <span className="badge">{interests.length}</span>
                        </button>
                    </nav>
                </div>

                <div className="profile-content">
                    {successMessage && (
                        <div className="success-message">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            {successMessage}
                        </div>
                    )}

                    {activeTab === 'account' && (
                        <div className="tab-content">
                            <div className="content-header">
                                <h2>Account Settings</h2>
                                {!isEditing ? (
                                    <button onClick={() => setIsEditing(true)} className="btn-edit">
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="action-buttons">
                                        <button onClick={() => setIsEditing(false)} className="btn-cancel">
                                            Cancel
                                        </button>
                                        <button onClick={handleSaveProfile} className="btn-save" disabled={isSaving}>
                                            {isSaving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="profile-form">
                                <div className="form-section avatar-section">
                                    <div className="avatar-upload">
                                        <Avatar user={currentUser} size="large" />
                                    </div>
                                </div>

                                <div className="form-section">
                                    <h3>Personal Information</h3>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                            />
                                            {errors.name && <span className="error-message">{errors.name}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label>Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                            />
                                            {errors.email && <span className="error-message">{errors.email}</span>}
                                        </div>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="form-section">
                                        <h3>Change Password</h3>
                                        <p className="section-description">Leave blank if you don't want to change your password</p>

                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label>New Password</label>
                                                <input
                                                    type="password"
                                                    name="newPassword"
                                                    value={formData.newPassword}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter new password"
                                                />
                                                {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
                                            </div>

                                            <div className="form-group">
                                                <label>Confirm Password</label>
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleInputChange}
                                                    placeholder="Confirm new password"
                                                />
                                                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                                            </div>
                                        </div>

                                        {formData.newPassword && (
                                            <PasswordStrengthMeter password={formData.newPassword} />
                                        )}
                                    </div>
                                )}

                                {errors.submit && (
                                    <div className="submit-error">
                                        {errors.submit}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'favorites' && (
                        <div className="tab-content relative">
                            <div className="blurred-content">
                                <div className="content-header">
                                    <h2>My Favorites</h2>
                                    <span className="count-badge">0 books</span>
                                </div>

                                <div className="empty-state">
                                    <div className="empty-icon">❤️</div>
                                    <h3>No favorites yet</h3>
                                    <p>Start adding books to your favorites to see them here!</p>
                                    <button className="btn-primary" disabled>
                                        Browse Books
                                    </button>
                                </div>
                            </div>

                            <div className="coming-soon-overlay">
                                <div className="coming-soon-card">
                                    <div className="coming-soon-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0110 0v4" />
                                        </svg>
                                    </div>
                                    <h3>Coming Soon</h3>
                                    <p>We're polishing the favorites system to give you the best experience. Stay tuned for the next update!</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'interests' && (
                        <div className="tab-content">
                            <div className="content-header">
                                <h2>My Programming Interests</h2>
                                <button onClick={handleSaveInterests} className="btn-save" disabled={isSaving}>
                                    {isSaving ? 'Saving...' : 'Save Interests'}
                                </button>
                            </div>

                            <div className="interests-content">
                                <p className="section-description">
                                    Update your interests to get better book recommendations tailored to your learning journey
                                </p>
                                <InterestsSelector
                                    selected={interests}
                                    onChange={setInterests}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <footer className="footer">
                <div className="container">
                    <p className="copyright">© 2026 BPRS. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default Profile;
