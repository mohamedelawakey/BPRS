import './LogoViewerModal.css';

function LogoViewerModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="logo-modal-overlay" onClick={onClose}>
            <div className="logo-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="logo-modal-close" onClick={onClose}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>

                <div className="logo-container">
                    <div className="logo-glow"></div>
                    <img src="/logo.png" alt="BPRS Logo In Detail" className="large-logo" />
                </div>

                <div className="logo-caption">
                    <h3>BPRS</h3>
                    <p>Programming Books Recommendation System</p>
                </div>
            </div>
        </div>
    );
}

export default LogoViewerModal;
