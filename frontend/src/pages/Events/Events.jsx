import React from "react";
import { useState } from "react";
import { Calendar } from "lucide-react";
import SearchBar from "../../components/SearchBar/SearchBar";
import SortDropdown from "../../components/SortDropdown/SortDropdown";
import EventCard from "../../components/EventCard/EventCard";
import Pagination from "../../components/Pagination/Pagination";
import BrowseCategory from "../../components/BrowseEvents/BrowseEvents";
import { mockEvents } from "../../services/Events/events"


export default function Events() {
  const [favorites, setFavorites] = useState(new Set());
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const eventsPerPage = 6;

  // Need to get this from the add as a category
  const categories = [
    { label: "Career Fairs", count: 12 },
    { label: "Workshops", count: 24 },
    { label: "Networking", count: 18 },
    { label: "Conferences", count: 8 },
    { label: "Bootcamps", count: 15 },
    { label: "Panels", count: 10 },
  ];

  const toggleFavorite = (index) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.label === selectedCategory ? null : category.label);
    setCurrentPage(1);
  };

  const handleSearch = (filters) => {
    setSearchQuery(filters.query);
    setCurrentPage(1);
  };

  // Filter events by search query and category
  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = !searchQuery || 
      event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags?.some(tag => tag.label.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory ||
      event.tags?.some(tag => tag.label.toLowerCase().includes(selectedCategory.toLowerCase()));
    
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/20 via-primary/5 to-background border-b border-border">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-10 h-10 text-primary" />
              <h1 className="text-4xl text-foreground">
                Career Events
              </h1>
            </div>

            <p className="text-xl text-muted-foreground mb-8 text-left">
              Discover networking events, workshops, and career fairs to
              accelerate your professional growth
            </p>

            <SearchBar 
              queryPlaceholder="Event name or topic" 
              showLocation={false}
              onSearch={handleSearch}
            />
          </div>
        </div>
      </section>

      {/* Events Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-foreground mb-1 text-left">
              Upcoming Events
            </h2>
            <p className="text-muted-foreground text-sm text-left">
              {filteredEvents.length} events available
              {selectedCategory && (
                <span className="ml-2 text-primary">
                  (filtered by {selectedCategory})
                </span>
              )}
            </p>
          </div>

          <SortDropdown
            value={sortBy}
            onValueChange={setSortBy}
          />
        </div>

        {/* Categories */}
        <BrowseCategory 
          title="Browse by Category"
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryClick={handleCategoryClick}
        />

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {currentEvents.map((event, index) => (
            <EventCard
              key={index}
              {...event}
              isFavorite={favorites.has(startIndex + index)}
              onFavoriteClick={() => toggleFavorite(startIndex + index)}
            />
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
