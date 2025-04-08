import React, { useState } from 'react';
import "../styles/Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [inputPage, setInputPage] = useState(currentPage);
  const [error, setError] = useState('');

  const handlePrev = () => {
    if (currentPage === 1) {
      onPageChange(totalPages);
    } else {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage === totalPages) {
      onPageChange(1);
    } else {
      onPageChange(currentPage + 1);
    }
  };

  const firstPage = () => {
    onPageChange(1);
  };

  const lastPage = () => {
    onPageChange(totalPages);
  };

  const handlePageInputChange = (event) => {
    const value = event.target.value;
    if (value === '' || /^[0-9]*$/.test(value)) { // Allow only numbers
      setInputPage(value);
      setError('');  // Clear error when user is typing
    }
  };

  const handlePageJump = () => {
    const page = parseInt(inputPage);
    if (isNaN(page) || page < 1 || page > totalPages) {
      setError(`Please enter a valid page number between 1 and ${totalPages}`);
    } else {
      onPageChange(page);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handlePageJump();
    }
  };

  return (
    <div className="pagination-controls">
      {/* First Page Button */}
      <button
        className="pagination-btn"
        onClick={firstPage}
        disabled={totalPages === 1}
        aria-label="First Page"
      >
        &laquo; {/* Left Double Arrow */}
      </button>

      {/* Prev Button */}
      <button
        className="pagination-btn"
        onClick={handlePrev}
        disabled={totalPages === 1}
        aria-label="Previous Page"
      >
        &larr; {/* Left Arrow */}
      </button>

      {/* Page Input for Jumping to a Page */}
      <div className="pagination-jump">
        <input
          type="text"
          value={inputPage}
          onChange={handlePageInputChange}
          onBlur={handlePageJump}  // Jump to page when input loses focus
          onKeyPress={handleKeyPress} // Listen for the Enter key
          aria-label="Jump to Page"
          placeholder="Go to page"
        />
        <button onClick={handlePageJump} aria-label="Jump to Page">
          Go
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="pagination-error">{error}</div>}

      {/* Page Info */}
      <span className="pagination-text">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next Button */}
      <button
        className="pagination-btn"
        onClick={handleNext}
        disabled={totalPages === 1}
        aria-label="Next Page"
      >
        &rarr; {/* Right Arrow */}
      </button>

      {/* Last Page Button */}
      <button
        className="pagination-btn"
        onClick={lastPage}
        disabled={totalPages === 1}
        aria-label="Last Page"
      >
        &raquo; {/* Right Double Arrow */}
      </button>
    </div>
  );
};

export default Pagination;
