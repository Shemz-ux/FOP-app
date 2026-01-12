import React from 'react';
import { Button } from '../Ui/Button';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  maxVisiblePages = 5,
}) {
  const handlePrevious = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    if (onPageChange && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show subset of pages with ellipsis
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, currentPage - halfVisible);
      let endPage = Math.min(totalPages, currentPage + halfVisible);

      // Adjust if we're near the start or end
      if (currentPage <= halfVisible) {
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - halfVisible) {
        startPage = totalPages - maxVisiblePages + 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <Button
        variant="outline"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="px-4 py-2"
      >
        Previous
      </Button>

      {pageNumbers.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? 'default' : 'outline'}
          onClick={() => handlePageClick(page)}
          className="px-4 py-2"
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2"
      >
        Next
      </Button>
    </div>
  );
}
