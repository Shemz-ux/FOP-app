import { useState } from 'react';
import Pagination from '../../../components/Pagination/Pagination';
import EmptyState from '../../../components/Ui/EmptyState';
import LoadingSpinner from '../../../components/Ui/LoadingSpinner';
import { PROFILE_ITEMS_PER_PAGE } from '../utils/profileOptions';

// Three-column card grid with pagination below when the items do not fit on one page.
// renderItem returns the card for one item and must set its key.
// empty is { icon, title, message }, shown when there are no items.
export default function PaginatedGrid({ items, renderItem, loading = false, empty, itemsPerPage = PROFILE_ITEMS_PER_PAGE }) {
  const [page, setPage] = useState(1);

  if (loading) return <LoadingSpinner size="lg" className="py-16" />;

  if (items.length === 0) {
    return empty ? <EmptyState icon={empty.icon} title={empty.title} message={empty.message} /> : null;
  }

  const totalPages = Math.ceil(items.length / itemsPerPage);
  // Step back when the last item on the final page is removed
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = items.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleItems.map(renderItem)}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </>
  );
}
