import React from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from '../Ui/Button';

export default function SearchBar({ onSearch }) {
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <form onSubmit={handleSearch} className="bg-card rounded-2xl p-2 flex flex-col md:flex-row items-stretch md:items-center gap-2 shadow-xl border border-border">
      {/* Search Input */}
      <div className="flex items-center gap-3 flex-1 px-4 py-2 md:py-0">
        <Search className="w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Job title or keyword"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-transparent border-none outline-none text-card-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Divider */}
      <div className="hidden md:block h-12 w-px bg-border" />
      <div className="md:hidden h-px w-full bg-border" />

      {/* Location Input */}
      <div className="flex items-center gap-3 flex-1 px-4 py-2 md:py-0">
        <MapPin className="w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Add country or city"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-transparent border-none outline-none text-card-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Search Button */}
      <Button type="submit" className="px-8 py-3 md:py-6 rounded-xl w-full md:w-auto">
        Search
      </Button>
    </form>
  );
}
