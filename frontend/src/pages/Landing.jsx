import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { searchApi } from '../utils/api';
import SearchBar from '../components/SearchBar';
import BackgroundParticles from '../components/BackgroundParticles';
import TechTicker from '../components/TechTicker';
import LoadingAnimation from '../components/LoadingAnimation';
import BookGrid from '../components/BookGrid';
import Pagination from '../components/Pagination';
import './Landing.css';

function Landing() {
    const navigate = useNavigate();
    const { trackGuestSearch, guestSearchCount, isAuthenticated } = useAuth();

    // Search states
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchError, setSearchError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [totalFound, setTotalFound] = useState(0);

    const searchInputRef = useRef(null);

    // Derive showBanner from guestSearchCount to fix the linter warning about setState in useEffect
    const showBanner = guestSearchCount > 0 && guestSearchCount <= 3;

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/app');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (guestSearchCount >= 3) {
            navigate('/signup');
        }
    }, [guestSearchCount, navigate]);

    const handleSearch = async (query) => {
        // Track the search and check limits
        const count = trackGuestSearch();

        // If they exceed the limit, redirect them to signup immediately
        if (count > 3) {
            navigate('/signup');
            return;
        }

        setSearchQuery(query);
        setIsLoading(true);
        setSearchError('');
        setCurrentPage(1);

        try {
            const data = await searchApi({ query: query });
            setSearchResults(data.results || []);
            setTotalFound(data.total_results || 0);
        } catch (err) {
            console.error("Search error:", err);
            setSearchError(err.message || 'Search failed. Please try again.');
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const currentBooks = searchResults.slice((currentPage - 1) * 12, currentPage * 12);

    return (
        <div className={`landing-page app ${searchResults.length === 0 ? 'no-scroll' : ''}`}>
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

            {showBanner && guestSearchCount <= 3 && (
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

            <main className="main-content">
                <h1 className="main-title">
                    Discover Your Next <span className="gradient-text">Programming Book</span>
                </h1>

                <SearchBar
                    ref={searchInputRef}
                    onSearch={handleSearch}
                    isLoading={isLoading}
                    onClear={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                        setTotalFound(0);
                        setSearchError('');
                    }}
                />

                {!searchQuery && <TechTicker />}

                {isLoading ? (
                    <LoadingAnimation />
                ) : searchError ? (
                    <div className="no-results">
                        <div className="no-results-icon">⚠️</div>
                        <h3>Search Error</h3>
                        <p>{searchError}</p>
                    </div>
                ) : !searchQuery ? (
                    <div className="no-results">
                        <div className="no-results-icon">🔍</div>
                        <h3>Search for a book</h3>
                        <p>Type a query above to find your next programming book.</p>
                    </div>
                ) : (
                    <>
                        {searchResults.length > 0 ? (
                            <>
                                <BookGrid books={currentBooks} searchQuery={searchQuery} totalResults={totalFound} />
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={Math.ceil(searchResults.length / 12)}
                                    onPageChange={handlePageChange}
                                />
                            </>
                        ) : (
                            <div className="no-results">
                                <div className="no-results-icon">📚</div>
                                <h3>No books found</h3>
                                <p>Try adjusting your search terms or look for a different category.</p>
                            </div>
                        )}
                    </>
                )}
            </main>


            <footer className="landing-footer">
                <div className="container">
                    <p>© 2026 Mohamed Mostafa Alawakey.</p>
                </div>
            </footer>
        </div >
    );
}

export default Landing;
