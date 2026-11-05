import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
    // Buttons never shrink (shrink-0 comes from Button), so a row too wide for
    // its container used to overflow and get clipped at both ends by
    // justify-center. Wrapping is the backstop; narrow screens also drop the
    // Previous/Next wording for arrows so the row normally still fits on one line.
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-2 mt-12"
    >
      <Button
        variant="outline"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="px-3 sm:px-4 py-2"
      >
        <ChevronLeft className="sm:hidden" aria-hidden="true" />
        <span className="hidden sm:inline">Previous</span>
      </Button>

      {pageNumbers.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? 'default' : 'outline'}
          onClick={() => handlePageClick(page)}
          aria-label={`Page ${page}`}
          aria-current={currentPage === page ? 'page' : undefined}
          className="px-3 sm:px-4 py-2"
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="px-3 sm:px-4 py-2"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="sm:hidden" aria-hidden="true" />
      </Button>
    </nav>
  );
}
