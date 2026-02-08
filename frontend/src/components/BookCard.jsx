import './BookCard.css';

function BookCard({ book, index }) {

    const handleViewBook = () => {
        const query = encodeURIComponent(`${book.title} ${book.author} book`);
        window.open(`https://www.google.com/search?q=${query}`, '_blank');
    };

    const getRandomGradient = () => {
        const gradients = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
            'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
        ];
        return gradients[index % gradients.length];
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <svg key={i} className="star star-filled" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                );
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <svg key={i} className="star star-half" viewBox="0 0 24 24">
                        <defs>
                            <linearGradient id={`half-${index}-${i}`}>
                                <stop offset="50%" stopColor="currentColor" />
                                <stop offset="50%" stopColor="transparent" />
                            </linearGradient>
                        </defs>
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                            fill={`url(#half-${index}-${i})`} stroke="currentColor" strokeWidth="1" />
                    </svg>
                );
            } else {
                stars.push(
                    <svg key={i} className="star star-empty" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                );
            }
        }
        return stars;
    };

    return (
        <div className="book-card" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="book-cover-wrapper">
                <div className="book-cover-placeholder" style={{ background: getRandomGradient() }}>
                    <div className="book-cover-content">
                        <span className="book-icon">📚</span>
                    </div>
                </div>
                <div className="book-badge">{book.category || 'Programming'}</div>
            </div>

            <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>

                <div className="book-rating">
                    <div className="stars">
                        {renderStars(book.rating)}
                    </div>
                    <span className="rating-value">{book.rating?.toFixed(1)}</span>
                    <span className="rating-count">({book.ratings_count?.toLocaleString() || 0})</span>
                </div>

                {book.description && (
                    <p className="book-description">{book.description}</p>
                )}

                <div className="book-meta">
                    {book.pages && (
                        <span className="meta-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" />
                                <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" />
                            </svg>
                            {book.pages} pages
                        </span>
                    )}
                    {book.year && (
                        <span className="meta-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            {book.year}
                        </span>
                    )}
                </div>

                <button className="book-details-btn" onClick={handleViewBook}>
                    View Book
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default BookCard;
