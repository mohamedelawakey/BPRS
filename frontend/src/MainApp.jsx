import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { searchApi } from './utils/api';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import LoadingAnimation from './components/LoadingAnimation';
import BookGrid from './components/BookGrid';
import Pagination from './components/Pagination';
import AboutModal from './components/AboutModal';
import LogoViewerModal from './components/LogoViewerModal';
import BackgroundParticles from './components/BackgroundParticles';
import TechTicker from './components/TechTicker';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import './App.css';

function MainApp() {
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchError, setSearchError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [totalFound, setTotalFound] = useState(0);
    const toastTimerRef = useRef(null);

    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
    const [isLogoViewerOpen, setIsLogoViewerOpen] = useState(false);
    const searchInputRef = useRef(null);

    const handleSearch = async (query) => {
        setSearchQuery(query);
        setIsLoading(true);
        setSearchError('');
        setCurrentPage(1);

        try {
            console.log("Sending search request with query:", query);
            const data = await searchApi({
                query: query
            });
            console.log("Received search response. Total results:", data.total_results, "Array length:", data.results?.length);
            setSearchResults(data.results || []);
            setTotalFound(data.total_results || 0);

            if (data.total_results > 0) {
                const message = data.total_results >= 100
                    ? `Found ${data.total_results} matching books! Currently, only the top 100 books are shown, but in future versions, you'll be able to see all results.`
                    : `Found ${data.total_results} matching books!`;

                // Reset toast state
                if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
                setIsClosing(false);
                setToastMessage(message);
                setShowToast(true);

                // Set timer for closing animation
                toastTimerRef.current = setTimeout(() => {
                    setIsClosing(true);
                    setTimeout(() => {
                        setShowToast(false);
                        setIsClosing(false);
                    }, 400); // Wait for exit animation
                }, 7600); // 8 seconds total
            } else {
                setShowToast(false);
            }
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

    // Global keyboard shortcuts
    useEffect(() => {
        const handleKeyboardShortcut = (e) => {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const modifierKey = isMac ? e.metaKey : e.ctrlKey;

            // Ctrl/Cmd + K: Focus search
            if (modifierKey && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }

            // Ctrl/Cmd + /: Toggle shortcuts modal
            if (modifierKey && e.key === '/') {
                e.preventDefault();
                setIsShortcutsOpen(prev => !prev);
            }

            // Ctrl/Cmd + G: Open GitHub
            if (modifierKey && e.key === 'g') {
                e.preventDefault();
                window.open('https://github.com/mohamedelawakey/BPRS', '_blank');
            }

            // Esc: Close modals
            if (e.key === 'Escape') {
                if (isAboutOpen) setIsAboutOpen(false);
                if (isShortcutsOpen) setIsShortcutsOpen(false);
                if (isLogoViewerOpen) setIsLogoViewerOpen(false);
                if (document.activeElement === searchInputRef.current) {
                    searchInputRef.current?.blur();
                }
            }
        };

        document.addEventListener('keydown', handleKeyboardShortcut);
        return () => document.removeEventListener('keydown', handleKeyboardShortcut);
    }, [isAboutOpen, isShortcutsOpen, isLogoViewerOpen]);

    const currentBooks = searchResults.slice((currentPage - 1) * 12, currentPage * 12);

    return (
        <div className={`app ${searchResults.length === 0 ? 'no-scroll' : ''}`}>
            <BackgroundParticles />

            <Header
                onAboutClick={() => setIsAboutOpen(true)}
                user={currentUser}
                onProfileClick={() => navigate('/profile')}
                onShortcutsClick={() => setIsShortcutsOpen(true)}
                onLogoClick={() => setIsLogoViewerOpen(true)}
            />

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

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <p className="copyright">© 2026 BPRS. All rights reserved.</p>
                </div>
            </footer>

            {showToast && (
                <div className={`toast-notification ${isClosing ? 'closing' : ''}`}>
                    <div className="toast-content">{toastMessage}</div>
                    <button className="toast-close" onClick={() => {
                        setIsClosing(true);
                        setTimeout(() => {
                            setShowToast(false);
                            setIsClosing(false);
                        }, 400);
                    }}>×</button>
                </div>
            )}

            <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
            <KeyboardShortcuts isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
            <LogoViewerModal isOpen={isLogoViewerOpen} onClose={() => setIsLogoViewerOpen(false)} />
        </div>
    );
}

export default MainApp;
