import { Search } from 'lucide-react';
import AdminSelect from '../../Components/AdminSelect';

export default function JobSearchFilter({
  searchValue,
  onSearchChange,
  statusValue,
  onStatusChange,
  featuredValue,
  onFeaturedChange,
  copy
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder={copy.placeholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <AdminSelect
          value={statusValue}
          onValueChange={onStatusChange}
          placeholder={copy.filterAll}
          options={[
            { value: 'all', label: copy.filterAll },
            { value: 'active', label: copy.filterActive },
            { value: 'closed', label: copy.filterClosed },
            { value: 'draft', label: copy.filterDraft }
          ]}
          className="w-full md:w-[180px]"
        />
        {/* Separate from status on purpose: featured is orthogonal to it. A job can be
            featured and closed, or featured and draft, so folding the two together would
            make "Featured" wrongly exclusive with "Active". */}
        <AdminSelect
          value={featuredValue}
          onValueChange={onFeaturedChange}
          placeholder={copy.featuredAll}
          options={[
            { value: 'all', label: copy.featuredAll },
            { value: 'featured-live', label: copy.featuredLive },
            { value: 'featured-expired', label: copy.featuredExpired },
            { value: 'not-featured', label: copy.featuredNone }
          ]}
          className="w-full md:w-[190px]"
        />
      </div>
    </div>
  );
}
