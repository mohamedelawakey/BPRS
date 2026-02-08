import './Pagination.css';

function Pagination({ currentPage, totalPages, onPageChange }) {
    const getPageNumbers = () => {
        const pages = [];
        const showPages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
        let endPage = Math.min(totalPages, startPage + showPages - 1);

        if (endPage - startPage < showPages - 1) {
            startPage = Math.max(1, endPage - showPages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="pagination">
            <button
                className="pagination-btn pagination-arrow"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18L9 12L15 6" />
                </svg>
                <span>Previous</span>
            </button>

            <div className="pagination-numbers">
                {currentPage > 3 && (
                    <>
                        <button
                            className="pagination-btn pagination-number"
                            onClick={() => onPageChange(1)}
                        >
                            1
                        </button>
                        {currentPage > 4 && <span className="pagination-ellipsis">...</span>}
                    </>
                )}

                {getPageNumbers().map((page) => (
                    <button
                        key={page}
                        className={`pagination-btn pagination-number ${page === currentPage ? 'active' : ''}`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                ))}

                {currentPage < totalPages - 2 && (
                    <>
                        {currentPage < totalPages - 3 && <span className="pagination-ellipsis">...</span>}
                        <button
                            className="pagination-btn pagination-number"
                            onClick={() => onPageChange(totalPages)}
                        >
                            {totalPages}
                        </button>
                    </>
                )}
            </div>

            <button
                className="pagination-btn pagination-arrow"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <span>Next</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18L15 12L9 6" />
                </svg>
            </button>
        </div>
    );
}

export default Pagination;
