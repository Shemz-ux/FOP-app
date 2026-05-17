import React from "react";
import { useState, useEffect, useMemo } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import SearchBar from "../../components/SearchBar/SearchBar";
import SortDropdown from "../../components/SortDropdown/SortDropdown";
import EventCard from "../../components/EventCard/EventCard";
import Pagination from "../../components/Pagination/Pagination";
import BrowseCategory from "../../components/BrowseEvents/BrowseEvents";
import LoadingSpinner from "../../components/Ui/LoadingSpinner";
import ErrorMessage from "../../components/Ui/ErrorMessage";
import EmptyState from "../../components/Ui/EmptyState";
import ViewToggle from "../../components/EventsCalendar/ViewToggle";
import EventFilterSlider from "../../components/EventsCalendar/EventFilterSlider";
import CalendarView from "../../components/EventsCalendar/Calendar";
import { eventsService } from "../../services";
import { useAuth } from "../../contexts/AuthContext";
import * as eventActionsService from "../../services/Events/eventActions";

let _eventsCache = null;

export default function Events() {
  const { user, isLoggedIn, isAdmin } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(!_eventsCache);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalEvents, setTotalEvents] = useState(0);
  const [categories, setCategories] = useState(_eventsCache?.categories || []);
  const [view, setView] = useState("grid");
  const [eventFilter, setEventFilter] = useState("all");

  const [allEventsForCalendar, setAllEventsForCalendar] = useState(_eventsCache?.events || []);

  const handleViewChange = (newView) => {
    if (newView === "calendar") setEventFilter("all");
    setView(newView);
  };
  const eventsPerPage = 6;

  const toggleFavorite = async (eventId) => {
    if (!isLoggedIn()) {
      navigate('/login');
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
      
      // Refetch saved events to ensure profile is up to date
      try {
        const { getSavedEventIds } = await import('../../services/Dashboard/dashboardService');
        const savedEventIds = await getSavedEventIds(user.userId, user.userType);
        setFavorites(new Set(savedEventIds));
      } catch (refetchErr) {
        console.error('Error refetching saved events:', refetchErr);
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

  // Fetch all events once for calendar, filtering and counts
  useEffect(() => {
    const loadAllEventsData = async () => {
      if (_eventsCache) {
        setAllEventsForCalendar(_eventsCache.events);
        setCategories(_eventsCache.categories);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await eventsService.getEventsAdvanced({ limit: 1000, is_active: true, sort: 'date_asc' });
        const allEvents = response.events || [];

        const eventTypes = {};
        allEvents.forEach(event => {
          if (event.event_type) {
            eventTypes[event.event_type] = (eventTypes[event.event_type] || 0) + 1;
          }
        });
        const cats = Object.entries(eventTypes).map(([label, count]) => ({ label, count }));

        _eventsCache = { events: allEvents, categories: cats };
        setAllEventsForCalendar(allEvents);
        setCategories(cats);
      } catch (err) {
        console.error('Error loading all events data:', err);
        setError(err.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    loadAllEventsData();
  }, []);

  const handleSearch = (filters) => {
    setSearchQuery(filters.query);
    setCurrentPage(1);
  };

  const now = new Date();

  // Derive upcoming / past counts from all fetched events
  const upcomingCount = useMemo(
    () => allEventsForCalendar.filter((e) => new Date(e.event_date) >= now).length,
    [allEventsForCalendar]
  );
  const pastCount = useMemo(
    () => allEventsForCalendar.filter((e) => new Date(e.event_date) < now).length,
    [allEventsForCalendar]
  );

  // All client-side: filter → sort → paginate from allEventsForCalendar
  const sortedSource = useMemo(() => {
    let source = allEventsForCalendar;
    if (searchQuery) source = source.filter((e) => e.title?.toLowerCase().includes(searchQuery.toLowerCase()));
    if (selectedCategory) source = source.filter((e) => e.event_type === selectedCategory);

    if (eventFilter === 'upcoming') {
      return source
        .filter((e) => new Date(e.event_date) >= now)
        .sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
    }
    if (eventFilter === 'past') {
      return source
        .filter((e) => new Date(e.event_date) < now)
        .sort((a, b) => new Date(b.event_date) - new Date(a.event_date));
    }
    // all: upcoming first, then past
    const upcoming = source.filter((e) => new Date(e.event_date) >= now).sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
    const past = source.filter((e) => new Date(e.event_date) < now).sort((a, b) => new Date(b.event_date) - new Date(a.event_date));
    return [...upcoming, ...past];
  }, [allEventsForCalendar, searchQuery, selectedCategory, eventFilter]);

  const totalPages = Math.ceil(sortedSource.length / eventsPerPage);

  const filteredEvents = useMemo(() => {
    const start = (currentPage - 1) * eventsPerPage;
    return sortedSource.slice(start, start + eventsPerPage);
  }, [sortedSource, currentPage]);

  // All events (not paginated) filtered by time – fed into the calendar
  const calendarEvents = useMemo(() => {
    if (eventFilter === "upcoming") return allEventsForCalendar.filter((e) => new Date(e.event_date) >= now);
    if (eventFilter === "past") return allEventsForCalendar.filter((e) => new Date(e.event_date) < now);
    return allEventsForCalendar;
  }, [allEventsForCalendar, eventFilter]);

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
              <CalendarIcon className="w-10 h-10 text-primary" />
              <h1 className="text-4xl text-foreground">
                Career Events
              </h1>
            </div>

            <p className="text-xl text-muted-foreground mb-8 text-left">
                Discover insight days, career masterclasses
                and network with employers to accelerate your career growth
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
              Career Events
            </h2>
            <p className="text-muted-foreground text-sm text-left">
              {sortedSource.length} events available
              {selectedCategory && (
                <span className="ml-2 text-primary">
                  (filtered by {selectedCategory})
                </span>
              )}
            </p>
          </div>

          {view === "grid" && (
            <SortDropdown
              value={sortBy}
              onValueChange={setSortBy}
            />
          )}
        </div>

        {view === "calendar" ? (
          /* ── Calendar View ── */
          <>
            {/* View toggle only — no filter slider in calendar view */}
            <div className="flex items-center gap-4 mb-8">
              <ViewToggle view={view} onViewChange={handleViewChange} />
            </div>
            {loading ? (
              <div className="py-20"><LoadingSpinner size="lg" /></div>
            ) : error ? (
              <ErrorMessage message={error} onRetry={fetchEvents} />
            ) : (
              <CalendarView events={calendarEvents} />
            )}
          </>
        ) : (
          /* ── Grid View ── */
          <>
            {/* Categories */}
            <BrowseCategory
              title="Categories"
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryClick={handleCategoryClick}
            />

            {/* View toggle + filter slider */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <ViewToggle view={view} onViewChange={handleViewChange} />
              <EventFilterSlider
                activeFilter={eventFilter}
                onFilterChange={(f) => { setEventFilter(f); setCurrentPage(1); }}
                upcomingCount={upcomingCount}
                pastCount={pastCount}
              />
            </div>

            {loading ? (
              <div className="py-20">
                <LoadingSpinner size="lg" />
              </div>
            ) : error ? (
              <ErrorMessage message={error} onRetry={fetchEvents} />
            ) : filteredEvents.length === 0 ? (
              <EmptyState 
                icon={CalendarIcon}
                title="No events found"
                message="Try adjusting your search or filter to find more events"
              />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {filteredEvents.map((event) => (
                    <EventCard
                      key={event.event_id}
                      eventId={event.event_id}
                      title={event.title}
                      organiser={event.organiser}
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
                      showSaveButton={!isAdmin()}
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
          </>
        )}
      </div>

    </div>
  );
}
