import { useState } from 'react';
import './KeyboardShortcuts.css';

// Detect user's operating system
const detectOS = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('mac') !== -1) return 'mac';
    if (userAgent.indexOf('linux') !== -1) return 'linux';
    return 'windows';
};

const shortcuts = {
    linux: [
        { keys: ['Ctrl', 'K'], description: 'Focus search bar' },
        { keys: ['Ctrl', '/'], description: 'Toggle keyboard shortcuts' },
        { keys: ['Ctrl', 'G'], description: 'Open GitHub repository' },
    ],
    mac: [
        { keys: ['⌘', 'K'], description: 'Focus search bar' },
        { keys: ['⌘', '/'], description: 'Toggle keyboard shortcuts' },
        { keys: ['⌘', 'G'], description: 'Open GitHub repository' },
    ],
    windows: [
        { keys: ['Ctrl', 'K'], description: 'Focus search bar' },
        { keys: ['Ctrl', '/'], description: 'Toggle keyboard shortcuts' },
        { keys: ['Ctrl', 'G'], description: 'Open GitHub repository' },
    ],
};

function KeyboardShortcuts({ isOpen, onClose }) {
    const [selectedOS, setSelectedOS] = useState(() => detectOS());

    if (!isOpen) return null;

    return (
        <>
            <div className="shortcuts-backdrop" onClick={onClose} />
            <div className="shortcuts-modal">
                <div className="shortcuts-header">
                    <h2 className="shortcuts-title">
                        <svg className="shortcuts-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="M6 8h.01M10 8h.01M14 8h.01M6 12h.01M10 12h.01M14 12h.01M6 16h.01M10 16h.01M14 16h.01M18 16h4M18 12h4M18 8h4" />
                        </svg>
                        Keyboard Shortcuts
                    </h2>
                    <button className="shortcuts-close" onClick={onClose} aria-label="Close">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6L18 18" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {/* OS Selection Tabs */}
                <div className="os-tabs">
                    <button
                        className={`os-tab ${selectedOS === 'linux' ? 'active' : ''}`}
                        onClick={() => setSelectedOS('linux')}
                    >
                        <svg className="os-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="4 17 10 11 4 5"></polyline>
                            <line x1="12" y1="19" x2="20" y2="19"></line>
                        </svg>
                        Linux
                    </button>
                    <button
                        className={`os-tab ${selectedOS === 'mac' ? 'active' : ''}`}
                        onClick={() => setSelectedOS('mac')}
                    >
                        <svg className="os-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                        </svg>
                        Mac
                    </button>
                    <button
                        className={`os-tab ${selectedOS === 'windows' ? 'active' : ''}`}
                        onClick={() => setSelectedOS('windows')}
                    >
                        <svg className="os-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 12V6.75l6-1.32v6.48L3 12m17-9v8.75l-10 .15V5.21L20 3M3 13l6 .09v6.81l-6-1.15V13m17 .25V22l-10-1.91V13.1l10 .15z" />
                        </svg>
                        Windows
                    </button>
                </div>

                {/* Shortcuts List */}
                <div className="shortcuts-list">
                    {shortcuts[selectedOS].map((shortcut, index) => (
                        <div key={index} className="shortcut-item">
                            <div className="shortcut-keys">
                                {shortcut.keys.map((key, keyIndex) => (
                                    <span key={keyIndex}>
                                        <kbd className="key">{key}</kbd>
                                        {keyIndex < shortcut.keys.length - 1 && (
                                            <span className="key-separator">+</span>
                                        )}
                                    </span>
                                ))}
                            </div>
                            <div className="shortcut-description">{shortcut.description}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default KeyboardShortcuts;
