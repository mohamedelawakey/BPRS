import './AboutModal.css';

function AboutModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>

                <div className="about-header">
                    <div className="about-logo-img">
                        <img src="/logo.png" alt="BPRS Logo" />
                    </div>
                    <h2 className="about-title">About <span className="text-gradient">BPRS</span></h2>
                </div>

                <div className="about-body">
                    <section className="about-section">
                        <h3>What is this?</h3>
                        <p>
                            The <strong>Book Recommendation System</strong> is a comprehensive, end-to-end platform
                            designed to help developers and learners navigate the vast world of programming literature.
                            In an era where thousands of technical books are available, finding the right resource
                            can be overwhelming. This system simplifies that journey by providing intelligent,
                            context-aware recommendations tailored to your interests.
                        </p>
                    </section>

                    <section className="about-section">
                        <h3>How It Works</h3>
                        <div className="features-grid">
                            <div className="feature-card">
                                <div className="feature-indicator"></div>
                                <div className="feature-content">
                                    <strong>Smart Search</strong>
                                    <p>Uses semantic understanding, not just keyword matching</p>
                                </div>
                            </div>
                            <div className="feature-card">
                                <div className="feature-indicator"></div>
                                <div className="feature-content">
                                    <strong>AI-Powered</strong>
                                    <p>Machine learning with modern embedding techniques</p>
                                </div>
                            </div>
                            <div className="feature-card">
                                <div className="feature-indicator"></div>
                                <div className="feature-content">
                                    <strong>Fast Results</strong>
                                    <p>Vector database (PGVector) for instant retrieval</p>
                                </div>
                            </div>
                            <div className="feature-card">
                                <div className="feature-indicator"></div>
                                <div className="feature-content">
                                    <strong>Modern UI</strong>
                                    <p>Beautiful React frontend with smooth animations</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="about-section">
                        <h3>Tech Stack</h3>
                        <div className="tech-tags">
                            <span className="tech-tag">Python</span>
                            <span className="tech-tag">FastAPI</span>
                            <span className="tech-tag">React</span>
                            <span className="tech-tag">Vite</span>
                            <span className="tech-tag">PostgreSQL</span>
                            <span className="tech-tag">PGVector</span>
                            <span className="tech-tag">Docker</span>
                            <span className="tech-tag">Docker Compose</span>
                            <span className="tech-tag">Shell</span>
                            <span className="tech-tag">Git</span>
                            <span className="tech-tag">GitHub</span>
                            <span className="tech-tag">Docs</span>
                        </div>
                    </section>

                    <section className="about-section about-author">
                        <h3>Developed by</h3>
                        <div className="author-card">
                            <div className="author-avatar-container">
                                <img src="public/favicon.png" alt="Mohamed Mostafa Alawakey Logo" className="author-avatar-img" />
                            </div>
                            <div className="author-info">
                                <strong>Mohamed Mostafa Alawakey</strong>
                                <p>AI & ML Engineer</p>
                                <a
                                    href="https://mohamedalawakey.pages.dev/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="author-link"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                        <polyline points="15 3 21 3 21 9" />
                                        <line x1="10" y1="14" x2="21" y2="3" />
                                    </svg>
                                    Visit My Portfolio
                                </a>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default AboutModal;
