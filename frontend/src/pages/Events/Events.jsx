import React from "react";
import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import SearchBar from "../../components/SearchBar/SearchBar";
import SortDropdown from "../../components/SortDropdown/SortDropdown";
import EventCard from "../../components/EventCard/EventCard";
import Pagination from "../../components/Pagination/Pagination";
import BrowseCategory from "../../components/BrowseEvents/BrowseEvents";
import LoadingSpinner from "../../components/Ui/LoadingSpinner";
import ErrorMessage from "../../components/Ui/ErrorMessage";
import EmptyState from "../../components/Ui/EmptyState";
import { eventsService } from "../../services";
import { useAuth } from "../../contexts/AuthContext";
import * as eventActionsService from "../../services/Events/eventActions";
import AuthModal from "../../components/AuthModal/AuthModal"


export default function Events() {
  const { user, isLoggedIn } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalEvents, setTotalEvents] = useState(0);
  const [categories, setCategories] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const eventsPerPage = 6;

  const toggleFavorite = async (eventId) => {
    if (!isLoggedIn()) {
      setShowAuthModal(true);
      return;
    }

    try {
      const isSaved = favorites.has(eventId);
      
      if (isSaved) {
        await eventActionsService.unsaveEvent(eventId, user.userId, user.userType);
        setFavorites((prev) => {
          const newSet = new Set(prev);
          newSet.delete(eventId);
          return newSet;
        });
      } else {
        await eventActionsService.saveEvent(eventId, user.userId, user.userType);
        setFavorites((prev) => new Set(prev).add(eventId));
      }
    } catch (err) {
      console.error('Error toggling event save:', err);
      alert('Failed to save event. Please try again.');
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.label === selectedCategory ? null : category.label);
    setCurrentPage(1);
  };

  // Fetch events from API
  useEffect(() => {
    fetchEvents();
  }, [currentPage, sortBy, searchQuery, selectedCategory]);

  // Load saved events on mount
  useEffect(() => {
    const loadSavedEvents = async () => {
      if (isLoggedIn() && user) {
        try {
          const { getSavedEventIds } = await import('../../services/Dashboard/dashboardService');
          const savedEventIds = await getSavedEventIds(user.userId, user.userType);
          setFavorites(new Set(savedEventIds));
        } catch (err) {
          console.error('Error loading saved events:', err);
        }
      }
    };
    loadSavedEvents();
  }, [isLoggedIn, user]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        page: currentPage,
        limit: eventsPerPage,
        is_active: true
      };

      if (searchQuery) filters.search = searchQuery;
      if (selectedCategory) filters.event_type = selectedCategory;

      const sortMap = {
        'recent': { sort_by: 'created_at', sort_order: 'desc' },
        'relevant': { sort_by: 'attendee_count', sort_order: 'desc' },
        'date': { sort_by: 'event_date', sort_order: 'asc' }
      };
      
      const sortConfig = sortMap[sortBy] || sortMap['date'];
      filters.sort_by = sortConfig.sort_by;
      filters.sort_order = sortConfig.sort_order;

      const response = await eventsService.getEventsAdvanced(filters);
      setEvents(response.events || []);
      setTotalEvents(response.pagination?.totalCount || 0);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories/event types
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await eventsService.getEventsAdvanced({ limit: 1000, is_active: true });
        const eventTypes = {};
        response.events?.forEach(event => {
          if (event.event_type) {
            eventTypes[event.event_type] = (eventTypes[event.event_type] || 0) + 1;
          }
        });
        const cats = Object.entries(eventTypes).map(([label, count]) => ({ label, count }));
        setCategories(cats);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    loadCategories();
  }, []);

  const handleSearch = (filters) => {
    setSearchQuery(filters.query);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalEvents / eventsPerPage);

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
              {totalEvents} events available
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
        {loading ? (
          <div className="py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchEvents} />
        ) : events.length === 0 ? (
          <EmptyState 
            icon={Calendar}
            title="No events found"
            message="Try adjusting your search or category filter to find more events"
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {events.map((event) => (
                <EventCard
                  key={event.event_id}
                  eventId={event.event_id}
                  title={event.title}
                  organizer={event.organiser}
                  date={new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  time={`${event.event_start_time?.slice(0, 5)} - ${event.event_end_time?.slice(0, 5)}`}
                  location={event.location}
                  attendees={event.attendee_count || 0}
                  description={event.description}
                  tags={event.tags || []}
                  image={event.event_image}
                  isFavorite={favorites.has(event.event_id)}
                  onFavoriteClick={() => toggleFavorite(event.event_id)}
                  createdAt={event.created_at}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}
