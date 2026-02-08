import { useState } from 'react';
import { PROGRAMMING_INTERESTS, INTEREST_CATEGORIES } from '../constants/interests';
import './InterestsSelector.css';

function InterestsSelector({ selected = [], onChange, maxSelections = null }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('categories'); // 'categories' or 'all'

    const handleToggle = (interest) => {
        if (selected.includes(interest)) {
            onChange(selected.filter(i => i !== interest));
        } else {
            if (maxSelections && selected.length >= maxSelections) {
                return; // Don't add more if max reached
            }
            onChange([...selected, interest]);
        }
    };

    const filteredInterests = PROGRAMMING_INTERESTS.filter(interest =>
        interest.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="interests-selector">
            <div className="interests-header">
                <div className="interests-search">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search interests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="view-toggle">
                    <button
                        className={`toggle-btn ${viewMode === 'categories' ? 'active' : ''}`}
                        onClick={() => setViewMode('categories')}
                    >
                        By Category
                    </button>
                    <button
                        className={`toggle-btn ${viewMode === 'all' ? 'active' : ''}`}
                        onClick={() => setViewMode('all')}
                    >
                        All
                    </button>
                </div>
            </div>

            <div className="selected-count">
                {selected.length} selected
                {maxSelections && ` (max ${maxSelections})`}
            </div>

            {viewMode === 'categories' && !searchTerm ? (
                <div className="interests-by-category">
                    {Object.entries(INTEREST_CATEGORIES).map(([category, interests]) => (
                        <div key={category} className="interest-category">
                            <h4 className="category-title">{category}</h4>
                            <div className="interests-grid">
                                {interests.map(interest => (
                                    <label key={interest} className="interest-item">
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(interest)}
                                            onChange={() => handleToggle(interest)}
                                            disabled={maxSelections && !selected.includes(interest) && selected.length >= maxSelections}
                                        />
                                        <span className="interest-label">{interest}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="interests-grid">
                    {filteredInterests.map(interest => (
                        <label key={interest} className="interest-item">
                            <input
                                type="checkbox"
                                checked={selected.includes(interest)}
                                onChange={() => handleToggle(interest)}
                                disabled={maxSelections && !selected.includes(interest) && selected.length >= maxSelections}
                            />
                            <span className="interest-label">{interest}</span>
                        </label>
                    ))}
                </div>
            )}

            {filteredInterests.length === 0 && (
                <div className="no-results">
                    <p>No interests found matching "{searchTerm}"</p>
                </div>
            )}
        </div>
    );
}

export default InterestsSelector;
