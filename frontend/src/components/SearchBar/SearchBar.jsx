import React from 'react';
import { Search, MapPin, X } from 'lucide-react';

export default function SearchBar({ 
  onSearch,
  onQueryChange,
  queryPlaceholder = "Job title or keyword",
  locationPlaceholder = "Search by location",
  showLocation = true
}) {
  const [query, setQuery] = React.useState('');
  const [location, setLocation] = React.useState('');

  const handleSearch = (e) => {
    if (e) {
      e.preventDefault();
    }
    if (onSearch) {
      onSearch({ query: query.trim(), location: location.trim() });
    }
  };

  // Opt-in live filtering: fires on every keystroke as well as on submit.
  // Only pass onQueryChange from a page that filters data it already holds -
  // on a page whose query feeds a fetch, this would be one request per
  // keypress.
  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onQueryChange) {
      onQueryChange(value.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onQueryChange) {
      onQueryChange('');
    }
    if (onSearch) {
      onSearch({ query: '', location: location.trim() });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <form onSubmit={handleSearch} className="bg-card rounded-2xl p-1.5 flex flex-col md:flex-row items-stretch md:items-center gap-2 shadow-xl border border-border">
      {/* Search Input. There is no submit button: live-filtering pages update as
          you type, and Enter submits on the pages that search on submit. */}
      <div className="flex items-center gap-3 flex-1 px-4 py-2">
        <Search className="w-5 h-5 text-muted-foreground shrink-0" />
        <input
          type="text"
          placeholder={queryPlaceholder}
          value={query}
          onChange={handleQueryChange}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-transparent border-none outline-none text-card-foreground placeholder:text-muted-foreground"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="shrink-0 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Divider - only show if location is enabled */}
      {showLocation && (
        <>
          <div className="hidden md:block h-12 w-px bg-border" />
          <div className="md:hidden h-px w-full bg-border" />
        </>
      )}

      {/* Location Input - conditionally rendered */}
      {showLocation && (
        <div className="flex items-center gap-3 flex-1 px-4 py-2 md:py-0">
          <MapPin className="w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder={locationPlaceholder}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent border-none outline-none text-card-foreground placeholder:text-muted-foreground"
          />
        </div>
      )}
    </form>
  );
}
