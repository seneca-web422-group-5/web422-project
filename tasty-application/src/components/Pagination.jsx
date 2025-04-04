import React from 'react';
import "../styles/Pagination.css";

const ITEMS_PER_PAGE = 12;

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination-controls">
      <button
        className="pagination-btn"
        onClick={handlePrev}
        disabled={currentPage === 1}
        aria-label="Previous Page"
      >
        &larr; {/* Left Arrow */}
      </button>
      <span className="pagination-text">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="pagination-btn"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Next Page"
      >
        &rarr; {/* Right Arrow */}
      </button>
    </div>
  );
};

export default Pagination;
