import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from '../components/SearchBar';
import BackgroundParticles from '../components/BackgroundParticles';
import './Landing.css';

function Landing() {
    const navigate = useNavigate();
    const { trackGuestSearch, guestSearchCount, isAuthenticated } = useAuth();
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/app');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (guestSearchCount >= 3) {
            navigate('/signup');
        } else if (guestSearchCount > 0 && !showBanner) {
            setShowBanner(true);
        }
    }, [guestSearchCount, navigate, showBanner]);

    const handleSearch = async () => {
        const count = trackGuestSearch();

        if (count >= 3) {
            setTimeout(() => {
                navigate('/signup');
            }, 1500);
        }
    };

    return (
        <div className="landing-page">
            <BackgroundParticles />

            <header className="landing-header">
                <div className="container">
                    <div className="logo" onClick={() => navigate('/')}>
                        <img src="/logo.png" alt="BPRS Logo" style={{ height: '50px', width: 'auto' }} />
                    </div>

                    <div className="header-actions">
                        <button onClick={() => navigate('/login')} className="btn-text">
                            Login
                        </button>
                        <button onClick={() => navigate('/signup')} className="btn-primary">
                            Sign Up Free
                        </button>
                    </div>
                </div>
            </header>

            {showBanner && guestSearchCount < 3 && (
                <div className="limit-banner">
                    <div className="container">
                        <p>
                            ⏰ You have <strong>{3 - guestSearchCount} search{3 - guestSearchCount !== 1 ? 'es' : ''}</strong> remaining.
                            <button onClick={() => navigate('/signup')} className="banner-link">
                                Sign up for unlimited access!
                            </button>
                        </p>
                    </div>
                </div>
            )}

            <main className="landing-main">
                <section className="hero-section">
                    <div className="container">
                        <div className="hero-content">
                            <h1 className="hero-title">
                                Discover Your Next <span className="gradient-text">Programming Book</span>
                            </h1>

                            <div className="hero-search">
                                <SearchBar onSearch={handleSearch} isLoading={false} />
                                <p className="search-hint">
                                    Try searching: "Python", "Machine Learning", "Clean Code"
                                </p>
                            </div>
                        </div>
                    </div>
                </section>




            </main>

            <footer className="landing-footer">
                <div className="container">
                    <p>© 2026 Mohamed Mostafa Alawakey.</p>
                </div>
            </footer>
        </div>
    );
}

export default Landing;
