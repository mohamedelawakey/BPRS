import { useState, useEffect, useRef, forwardRef } from 'react';
import Fuse from 'fuse.js';
import { searchSuggestions } from '../constants/searchSuggestions';
import './SearchBar.css';

const SearchBar = forwardRef(({ onSearch, isLoading, onClear }, ref) => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    // Initialize Fuse.js for fuzzy searching
    const fuse = useRef(new Fuse(searchSuggestions, {
        threshold: 0.3, // 0 = exact match, 1 = match anything
        distance: 100,
        minMatchCharLength: 2,
        keys: ['']
    }));

    // Handle clicks outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Update suggestions when query changes
    useEffect(() => {
        if (query.trim().length >= 2) {
            const results = fuse.current.search(query);
            const suggestionList = results.slice(0, 8).map(result => result.item);
            setSuggestions(suggestionList);
            setShowSuggestions(suggestionList.length > 0);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
        setSelectedIndex(-1);
    }, [query]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim() && !isLoading) {
            onSearch(query.trim());
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion);
        onSearch(suggestion);
        setShowSuggestions(false);
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                if (selectedIndex >= 0) {
                    e.preventDefault();
                    handleSuggestionClick(suggestions[selectedIndex]);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setSelectedIndex(-1);
                break;
            default:
                break;
        }
    };

    return (
        <div className="search-section" ref={searchRef}>
            <div className="search-content">
                <form className={`search-form ${isFocused ? 'focused' : ''}`} onSubmit={handleSubmit}>
                    <div className="search-input-wrapper">
                        <div className="search-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <input
                            ref={ref}
                            type="text"
                            className="search-input"
                            placeholder="Search for Python, JavaScript, Machine Learning..."
                            value={query}
                            onChange={(e) => {
                                const val = e.target.value;
                                setQuery(val);
                                if (val.trim() === '' && onClear) {
                                    onClear();
                                }
                            }}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => {
                                setIsFocused(false);
                                // Delay to allow click on suggestions
                                setTimeout(() => setShowSuggestions(false), 200);
                            }}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                            autoComplete="off"
                        />
                        {query && (
                            <button
                                type="button"
                                className="clear-button"
                                onClick={() => {
                                    setQuery('');
                                    if (onClear) {
                                        onClear();
                                    }
                                }}
                                disabled={isLoading}
                                aria-label="Clear search"
                            >
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        )}
                        <button
                            type="submit"
                            className={`search-button ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading || !query.trim()}
                        >
                            {isLoading ? (
                                <span className="button-loader"></span>
                            ) : (
                                <>
                                    <span>Search</span>
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Autocomplete Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="autocomplete-dropdown">
                            {suggestions.map((suggestion, index) => (
                                <div
                                    key={suggestion}
                                    className={`autocomplete-item ${index === selectedIndex ? 'selected' : ''}`}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                >
                                    <svg className="suggestion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <circle cx="11" cy="11" r="8" strokeWidth="2" />
                                        <path d="M21 21L16.65 16.65" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    <span className="suggestion-text">{suggestion}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </form>

                <div className="search-suggestions">
                    <span className="suggestions-label">Try Demo:</span>
                    <div className="suggestion-tags">
                        {['Python', 'JavaScript', 'Machine Learning', 'Clean Code', 'System Design'].map((tag) => (
                            <button
                                key={tag}
                                className="suggestion-tag"
                                onClick={() => {
                                    setQuery(tag);
                                    onSearch(tag);
                                }}
                                disabled={isLoading}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
