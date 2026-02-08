import { validatePasswordStrength } from '../utils/validators';
import './PasswordStrengthMeter.css';

function PasswordStrengthMeter({ password }) {
    if (!password) return null;

    const { strength, score, checks } = validatePasswordStrength(password);

    const getColor = () => {
        if (strength === 'strong') return '#43e97b';
        if (strength === 'medium') return '#fee140';
        return '#ff6b6b';
    };

    return (
        <div className="password-strength-meter">
            <div className="strength-bar-container">
                <div
                    className="strength-bar"
                    style={{
                        width: `${score}%`,
                        backgroundColor: getColor()
                    }}
                />
            </div>

            <div className="strength-label" style={{ color: getColor() }}>
                {strength === 'strong' && '💪 Strong Password'}
                {strength === 'medium' && '👍 Medium Password'}
                {strength === 'weak' && '⚠️ Weak Password'}
            </div>

            <div className="password-requirements">
                <div className={`requirement ${checks.length ? 'met' : ''}`}>
                    {checks.length ? '✓' : '○'} At least 8 characters
                </div>
                <div className={`requirement ${checks.uppercase ? 'met' : ''}`}>
                    {checks.uppercase ? '✓' : '○'} One uppercase letter
                </div>
                <div className={`requirement ${checks.lowercase ? 'met' : ''}`}>
                    {checks.lowercase ? '✓' : '○'} One lowercase letter
                </div>
                <div className={`requirement ${checks.number ? 'met' : ''}`}>
                    {checks.number ? '✓' : '○'} One number
                </div>
                <div className={`requirement ${checks.special ? 'met' : ''}`}>
                    {checks.special ? '✓' : '○'} One special character
                </div>
            </div>
        </div>
    );
}

export default PasswordStrengthMeter;
