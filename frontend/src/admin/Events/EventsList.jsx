import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Eye, BarChart, Trash2, Edit, Home, CheckCircle, XCircle, Calendar } from 'lucide-react';
import AdminSelect from '../Components/AdminSelect';
import ConfirmModal from '../../components/Ui/ConfirmModal';
import Toast from '../../components/Ui/Toast';
import { apiGet, apiDelete } from '../../services/api';

export default function EventsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 9;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await apiGet('/events');
        setEvents(data.events || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;
    
    try {
      await apiDelete(`/events/${eventToDelete.event_id}`);
      setEvents(events.filter(event => event.event_id !== eventToDelete.event_id));
      setToast({
        message: 'Event deleted successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      setToast({
        message: 'Failed to delete event',
        type: 'error'
      });
    } finally {
      setShowDeleteModal(false);
      setEventToDelete(null);
    }
  };

  const getEventStatus = (event) => {
    // Check if event is published
    if (!event.is_active) {
      return 'draft';
    }
    
    // For published events, check date
    const eventDate = new Date(event.event_date);
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Reset time to start of day
    
    if (eventDate > now) return 'upcoming';
    if (eventDate < now) return 'past';
    return 'ongoing';
  };

  const filteredEvents = events.filter(event => {
    // Search filter - only apply if searchTerm is not empty
    const matchesSearch = !searchTerm.trim() || 
                         (event.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.organiser || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    const status = getEventStatus(event);
    const matchesFilter = filterStatus === 'all' || status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6 text-left">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link to="/admin" className="hover:text-foreground transition-colors flex items-center gap-1">
          <Home className="w-4 h-4" />
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-foreground">Events</span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-foreground">Event Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage all events and registrations</p>
        </div>
        <Link
          to="/admin/events/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 whitespace-nowrap w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span className="sm:inline">Create New Event</span>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Total Events</p>
              <p className="text-2xl sm:text-3xl mb-1 text-foreground">{events.length}</p>
            </div>
            <div className="p-2 sm:p-3 rounded-xl bg-primary/10">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Active Events</p>
              <p className="text-2xl sm:text-3xl mb-1 text-green-500">{events.filter(e => e.is_active).length}</p>
            </div>
            <div className="p-2 sm:p-3 rounded-xl bg-green-500/10">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search events by title, organiser, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <AdminSelect
            value={filterStatus}
            onValueChange={setFilterStatus}
            placeholder="All Status"
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'upcoming', label: 'Upcoming' },
              { value: 'past', label: 'Past' },
              { value: 'draft', label: 'Draft' }
            ]}
            className="w-full md:w-[180px]"
          />
        </div>
      </div>

      {/* Events Table - Desktop */}
      <div className="hidden md:block bg-card border border-border rounded-xl overflow-hidden">
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No events found</h3>
            <p className="text-sm text-muted-foreground text-center">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No events have been created yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left px-6 py-4 text-sm text-foreground">Event Title</th>
                  <th className="text-left px-6 py-4 text-sm text-foreground">Organiser</th>
                  <th className="text-left px-6 py-4 text-sm text-foreground">Date</th>
                  <th className="text-left px-6 py-4 text-sm text-foreground">Attendees</th>
                  <th className="text-left px-6 py-4 text-sm text-foreground">Status</th>
                  <th className="text-left px-6 py-4 text-sm text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentEvents.map(event => {
                const status = getEventStatus(event);
                return (
                <tr key={event.event_id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 text-foreground">{event.title}</td>
                  <td className="px-6 py-4 text-muted-foreground">{event.organiser || 'N/A'}</td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(event.event_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-muted-foreground">{event.applicant_count || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ${
                      event.is_active
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                        : 'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {event.is_active ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          Inactive
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/events/${event.event_id}`}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title="View details"
                      >
                        <BarChart className="w-4 h-4 text-foreground" />
                      </Link>
                      <Link
                        to={`/admin/events/${event.event_id}/edit`}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title="Edit event"
                      >
                        <Edit className="w-4 h-4 text-foreground" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(event)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete event"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Events Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No events found</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No events have been created yet'}
              </p>
            </div>
          </div>
        ) : (
          currentEvents.map(event => (
          <div key={event.event_id} className="bg-card border border-border rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-medium text-foreground mb-1 truncate">{event.title}</h3>
                <p className="text-sm text-muted-foreground truncate">{event.organiser || 'N/A'}</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                event.is_active
                  ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                  : 'bg-red-500/10 text-red-500 border border-red-500/20'
              }`}>
                {event.is_active ? (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    Active
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3" />
                    Inactive
                  </>
                )}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(event.event_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>{event.applicant_count || 0} attendees</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <Link
                to={`/admin/events/${event.event_id}`}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-sm"
              >
                <BarChart className="w-4 h-4" />
                View
              </Link>
              <Link
                to={`/admin/events/${event.event_id}/edit`}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-sm"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Link>
              <button
                onClick={() => handleDeleteClick(event)}
                className="px-3 py-2 border border-red-500/20 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
          ))
        )}
        
        {/* Mobile Pagination */}
        {filteredEvents.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Previous
            </button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Event"
        message={`Are you sure you want to delete "${eventToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
