import './Avatar.css';

function Avatar({ user, showStatus = false, size = 'medium', onClick, showEmail = false }) {
    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const getEmailUsername = (email) => {
        if (!email) return '';
        return email.split('@')[0];
    };

    const sizeClass = `avatar-${size}`;

    return (
        <div className={`avatar-wrapper ${showEmail ? 'with-email' : ''}`}>
            <div
                className={`avatar ${sizeClass} ${onClick ? 'clickable' : ''}`}
                onClick={onClick}
                title={user?.name || 'User'}
            >
                {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="avatar-image" />
                ) : (
                    <div className="avatar-initials">
                        {getInitials(user?.name || 'User')}
                    </div>
                )}

                {showStatus && (
                    <div className="avatar-status" title="Active now">
                        <div className="status-dot"></div>
                    </div>
                )}
            </div>

            {showEmail && user?.email && (
                <span className="avatar-email">{getEmailUsername(user.email)}</span>
            )}
        </div>
    );
}

export default Avatar;
