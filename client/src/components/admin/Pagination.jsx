import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable pagination component for admin pages.
 *
 * Usage:
 * <Pagination
 *   page={pagination.page}
 *   totalPages={pagination.pages}
 *   onPageChange={(newPage) => setPage(newPage)}
 * />
 */
const Pagination = ({
    page,
    totalPages,
    onPageChange,
    totalItems = null,
    perPage = null,
    showInfo = true,
    className = ''
}) => {
    if (totalPages <= 1) return null;

    const handlePrevious = () => {
        if (page > 1) {
            onPageChange(page - 1);
        }
    };

    const handleNext = () => {
        if (page < totalPages) {
            onPageChange(page + 1);
        }
    };

    return (
        <div className={`pagination flex items-center justify-between mt-6 ${className}`}>
            <button
                className="pagination-btn px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                disabled={page === 1}
                onClick={handlePrevious}
            >
                Previous
            </button>

            <div className="pagination-info text-sm text-gray-600">
                {showInfo && totalItems !== null && perPage !== null ? (
                    <span>
                        Showing {Math.min((page - 1) * perPage + 1, totalItems)} - {Math.min(page * perPage, totalItems)} of {totalItems}
                    </span>
                ) : (
                    <span>Page {page} of {totalPages}</span>
                )}
            </div>

            <button
                className="pagination-btn px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                disabled={page >= totalPages}
                onClick={handleNext}
            >
                Next
            </button>
        </div>
    );
};

Pagination.propTypes = {
    page: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    totalItems: PropTypes.number,
    perPage: PropTypes.number,
    showInfo: PropTypes.bool,
    className: PropTypes.string
};

export default Pagination;
