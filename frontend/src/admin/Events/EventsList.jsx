import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Eye, BarChart, Trash2, Edit, Home } from 'lucide-react';
import AdminSelect from '../Components/AdminSelect';
import { apiGet, apiDelete } from '../../services/api';

export default function EventsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await apiDelete(`/events/${eventId}`);
      setEvents(events.filter(event => event.event_id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  const getEventStatus = (event) => {
    const eventDate = new Date(event.event_date);
    const now = new Date();
    if (eventDate > now) return 'upcoming';
    if (eventDate < now) return 'past';
    return 'ongoing';
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = (event.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.organiser || '').toLowerCase().includes(searchTerm.toLowerCase());
    const status = getEventStatus(event);
    const matchesFilter = filterStatus === 'all' || status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2 text-foreground">Event Management</h1>
          <p className="text-muted-foreground">Manage all events and registrations</p>
        </div>
        <Link
          to="/admin/events/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          Create New Event
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search events by title or organizer..."
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
              { value: 'cancelled', label: 'Cancelled' }
            ]}
            className="w-full md:w-[180px]"
          />
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left px-6 py-4 text-sm text-foreground">Event Title</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Organizer</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Date</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Attendees</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Status</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEvents.map(event => {
                const status = getEventStatus(event);
                return (
                <tr key={event.event_id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 text-foreground">{event.title}</td>
                  <td className="px-6 py-4 text-muted-foreground">{event.organiser || 'N/A'}</td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(event.event_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-muted-foreground">{event.applicant_count || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      event.is_active
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-red-500/20 text-red-500'
                    }`}>
                      {event.is_active ? 'Active' : 'Inactive'}
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
                        onClick={() => handleDelete(event.event_id)}
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
      </div>
        </div>
      </div>
    </div>
  );
}
