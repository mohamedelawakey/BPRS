import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
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

// Mock book data for demonstration
const mockBooks = [
    {
        id: 1,
        title: "Clean Code: A Handbook of Agile Software Craftsmanship",
        author: "Robert C. Martin",
        rating: 4.7,
        ratings_count: 15420,
        pages: 464,
        year: 2008,
        category: "Software Engineering",
        description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees."
    },
    {
        id: 2,
        title: "The Pragmatic Programmer: Your Journey to Mastery",
        author: "David Thomas, Andrew Hunt",
        rating: 4.8,
        ratings_count: 12890,
        pages: 352,
        year: 2019,
        category: "Programming",
        description: "Straight from the trenches, The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development."
    },
    {
        id: 3,
        title: "Design Patterns: Elements of Reusable Object-Oriented Software",
        author: "Gang of Four",
        rating: 4.5,
        ratings_count: 8920,
        pages: 416,
        year: 1994,
        category: "Software Design",
        description: "Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions."
    },
    {
        id: 4,
        title: "Introduction to Algorithms",
        author: "Thomas H. Cormen",
        rating: 4.6,
        ratings_count: 7650,
        pages: 1312,
        year: 2009,
        category: "Algorithms",
        description: "A comprehensive textbook covering the modern thinking on algorithms."
    },
    {
        id: 5,
        title: "Python Crash Course",
        author: "Eric Matthes",
        rating: 4.7,
        ratings_count: 11230,
        pages: 544,
        year: 2019,
        category: "Python",
        description: "A hands-on, project-based introduction to programming with Python."
    },
    {
        id: 6,
        title: "JavaScript: The Good Parts",
        author: "Douglas Crockford",
        rating: 4.3,
        ratings_count: 6780,
        pages: 176,
        year: 2008,
        category: "JavaScript",
        description: "Most programming languages contain good and bad parts, but JavaScript has more than its share of the bad."
    },
    {
        id: 7,
        title: "Hands-On Machine Learning with Scikit-Learn and TensorFlow",
        author: "Aurélien Géron",
        rating: 4.8,
        ratings_count: 9340,
        pages: 856,
        year: 2019,
        category: "Machine Learning",
        description: "Through a series of recent breakthroughs, deep learning has boosted the entire field of machine learning."
    },
    {
        id: 8,
        title: "System Design Interview",
        author: "Alex Xu",
        rating: 4.6,
        ratings_count: 5420,
        pages: 320,
        year: 2020,
        category: "System Design",
        description: "System design interviews are now the most important and the must-have skill for software engineers."
    },
    {
        id: 9,
        title: "Cracking the Coding Interview",
        author: "Gayle Laakmann McDowell",
        rating: 4.7,
        ratings_count: 14560,
        pages: 708,
        year: 2015,
        category: "Interviews",
        description: "189 programming questions and solutions, from Google, Microsoft, Apple, Facebook, and more."
    },
    {
        id: 10,
        title: "Structure and Interpretation of Computer Programs",
        author: "Harold Abelson",
        rating: 4.5,
        ratings_count: 4890,
        pages: 657,
        year: 1996,
        category: "Computer Science",
        description: "A textbook aiming to teach the principles of computer programming."
    },
    {
        id: 11,
        title: "Learning React: Modern Patterns for Developing React Apps",
        author: "Alex Banks, Eve Porcello",
        rating: 4.4,
        ratings_count: 3210,
        pages: 350,
        year: 2020,
        category: "React",
        description: "If you want to learn how to build efficient React applications, this is your book."
    },
    {
        id: 12,
        title: "Node.js Design Patterns",
        author: "Mario Casciaro",
        rating: 4.5,
        ratings_count: 2890,
        pages: 526,
        year: 2020,
        category: "Node.js",
        description: "Learn proven patterns, techniques, and tricks to take full advantage of Node.js."
    },
];

function MainApp() {
    const [isLoading, setIsLoading] = useState(true);
    const [books, setBooks] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
    const [isLogoViewerOpen, setIsLogoViewerOpen] = useState(false);
    const searchInputRef = useRef(null);

    // Simulate loading
    useEffect(() => {
        setTimeout(() => {
            setBooks(mockBooks); // Assuming mockBooks is available or defined
            setSearchResults(mockBooks);
            setIsLoading(false);
        }, 1500);
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        setIsLoading(true);
        // Simulate search delay
        setTimeout(() => {
            if (!query.trim()) {
                setSearchResults(books);
            } else {
                // ... search logic
                const results = books.filter(book =>
                    book.title.toLowerCase().includes(query.toLowerCase()) ||
                    book.author.toLowerCase().includes(query.toLowerCase()) ||
                    book.category.toLowerCase().includes(query.toLowerCase())
                );
                setSearchResults(results);
            }
            setIsLoading(false);
            setCurrentPage(1);
        }, 500);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Global keyboard shortcuts
    useEffect(() => {
        const handleKeyboardShortcut = (e) => {
            // Detect if user is on Mac (use Cmd) or Windows/Linux (use Ctrl)
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
        <div className="app">
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
                        setSearchResults(books);
                    }}
                />

                {!searchQuery && <TechTicker />}

                {isLoading ? (
                    <LoadingAnimation />
                ) : (
                    <>
                        {searchResults.length > 0 ? (
                            <>
                                <BookGrid books={currentBooks} searchQuery={searchQuery} />
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

            <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
            <KeyboardShortcuts isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
            <LogoViewerModal isOpen={isLogoViewerOpen} onClose={() => setIsLogoViewerOpen(false)} />
        </div>
    );
}

export default MainApp;
