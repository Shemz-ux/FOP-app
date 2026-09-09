import { Search } from "lucide-react";
import AdminSelect from "../../Components/AdminSelect";

export default function WebinarSearchFilter({ 
  searchValue, 
  onSearchChange, 
  filterValue, 
  onFilterChange,
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
          value={filterValue}
          onValueChange={onFilterChange}
          placeholder={copy.filterAll}
          options={[
            { value: 'all', label: copy.filterAll },
            { value: 'published', label: copy.filterPublished },
            { value: 'draft', label: copy.filterDraft }
          ]}
          className="w-full md:w-[180px]"
        />
      </div>
    </div>
  );
}
