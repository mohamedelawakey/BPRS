import { useState } from 'react';
import Avatar from './Avatar';
import './Header.css';

function Header({ onAboutClick, user, onProfileClick, onShortcutsClick, onLogoClick }) {
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <header className="header">
            <div className="container header-content">
                <div className="logo" onClick={onLogoClick}>
                    <img src="/logo.png" alt="BPRS Logo" className="logo-image" />
                </div>

                <nav className="nav-links">
                    <a href="#" className="nav-link active">Home</a>
                    <button onClick={onAboutClick} className="nav-link nav-button">About</button>

                    <div className="nav-divider"></div>

                    {/* GitHub Icon */}
                    <a
                        href="https://github.com/mohamedelawakey/BPRS"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nav-icon-link"
                        aria-label="View source on GitHub"
                        title="View Source on GitHub"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                    </a>

                    {/* Keyboard Shortcuts Icon */}
                    <button
                        onClick={onShortcutsClick}
                        className="nav-icon-link nav-button"
                        aria-label="Keyboard shortcuts"
                        title="Keyboard Shortcuts (Ctrl+/)"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="M6 8h.01M10 8h.01M14 8h.01M6 12h.01M10 12h.01M14 12h.01M6 16h.01M10 16h.01M14 16h8" />
                        </svg>
                    </button>

                    {/* Activity Status Indicator */}
                    {user && (
                        <div className="activity-indicator" title="Active now">
                            <div className="activity-dot"></div>
                        </div>
                    )}

                    {/* User Avatar with dropdown */}
                    {user && (
                        <div className="user-menu-wrapper">
                            <button
                                className="user-avatar-btn"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                <Avatar user={user} size="small" showStatus={false} showEmail={true} />
                            </button>

                            {showUserMenu && (
                                <>
                                    <div
                                        className="menu-backdrop"
                                        onClick={() => setShowUserMenu(false)}
                                    />
                                    <div className="user-dropdown">
                                        <div className="dropdown-header">
                                            <Avatar user={user} size="medium" />
                                            <div className="user-info">
                                                <div className="user-name">{user.name}</div>
                                                <div className="user-email">{user.email}</div>
                                            </div>
                                        </div>

                                        <div className="dropdown-divider"></div>

                                        <button onClick={() => {
                                            setShowUserMenu(false);
                                            onProfileClick();
                                        }} className="dropdown-item">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                            Profile Settings
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;
