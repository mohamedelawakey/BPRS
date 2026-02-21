import { memo } from 'react';
import BookCard from './BookCard';
import './BookGrid.css';

function BookGrid({ books, searchQuery, totalResults }) {
    return (
        <section className="results-section">
            <div className="container">
                <div className="results-header">
                    {searchQuery ? (
                        <>
                            <h2 className="results-title">
                                Results for "<span className="text-gradient">{searchQuery}</span>"
                            </h2>
                            <p className="results-count">
                                Found <strong>{totalResults !== undefined ? totalResults : books.length}</strong> books matching your search
                            </p>
                        </>
                    ) : (
                        <h2 className="results-title">
                            Recommended <span className="text-gradient">Books</span>
                        </h2>
                    )}
                </div>

                <div className="books-grid">
                    {books.map((book, index) => (
                        <BookCard key={book.id || index} book={book} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default memo(BookGrid);
