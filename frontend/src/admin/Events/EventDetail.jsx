import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Eye, Trash2, Pencil } from 'lucide-react';
import { ProfileView } from '../Components/ProfileView';
import ConfirmModal from '../../components/Ui/ConfirmModal';
import Toast from '../../components/Ui/Toast';
import { apiGet, apiDelete } from '../../services/api';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedAttendeeId, setSelectedAttendeeId] = useState(null);
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await apiGet(`/events/${id}`);
        console.log('Event API response:', response);
        const eventData = response.event || response;
        console.log('Event data:', eventData);
        setEvent(eventData);
        
        // Fetch attendees for this event
        try {
          const attendeesData = await apiGet(`/events/${id}/registrations`);
          console.log('Attendees data:', attendeesData);
          setAttendees(attendeesData.registrations || []);
        } catch (regError) {
          console.error('Error fetching attendees:', regError);
          setAttendees([]);
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEventDetails();
  }, [id]);

  const handleDeleteClick = () => {
    setConfirmModal({ isOpen: true });
  };

  const handleDeleteConfirm = async () => {
    try {
      await apiDelete(`/events/${event.event_id}`);
      setToast({
        message: `"${event.title}" has been deleted successfully`,
        type: 'success'
      });
      setTimeout(() => {
        navigate('/admin/events');
      }, 1500);
    } catch (error) {
      console.error('Error deleting event:', error);
      setToast({
        message: 'Failed to delete event. Please try again.',
        type: 'error'
      });
    }
  };

  // If viewing an attendee profile
  if (selectedAttendeeId) {
    const attendee = attendees.find(a => a.registration_id === selectedAttendeeId);
    const profile = attendee ? {
      name: `${attendee.jobseeker?.first_name || ''} ${attendee.jobseeker?.last_name || ''}`.trim(),
      email: attendee.jobseeker?.email || 'N/A',
      phone: attendee.jobseeker?.phone_number || 'N/A',
      university: attendee.jobseeker?.institution_name || 'N/A',
      course: attendee.jobseeker?.area_of_study || 'N/A',
      year: attendee.jobseeker?.uni_year || 'N/A'
    } : null;
    
    return <ProfileView profile={profile} onClose={() => setSelectedAttendeeId(null)} type="attendee" />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="space-y-6 text-left">
        <button
          onClick={() => navigate('/admin/events')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Events</span>
        </button>
        <div className="text-center py-12">
          <h2 className="text-2xl text-foreground mb-2">Event Not Found</h2>
          <p className="text-muted-foreground">The event you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-7xl">
        <div className="space-y-4 sm:space-y-6 text-left">
      <button
        onClick={() => navigate('/admin/events')}
        className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors mb-2 sm:mb-4"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>Back to Events</span>
      </button>
      
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl mb-2 text-foreground">{event.title}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">{event.organiser || event.organiser}</p>
        </div>
        
        {/* Desktop Button Layout */}
        <div className="hidden sm:flex gap-2 flex-wrap">
          <a
            href={`/events/${event.event_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-secondary transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            View on Website
          </a>
          <Link
            to={`/admin/events/${event.event_id}/edit`}
            className="flex items-center gap-2 px-4 py-2 border border-green-500/50 text-green-500 rounded-lg hover:bg-secondary text-sm"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={handleDeleteClick}
            className="flex items-center gap-2 px-4 py-2 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
        
        {/* Mobile Button Layout */}
        <div className="sm:hidden grid grid-cols-2 gap-2">
          <a
            href={`/events/${event.event_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2.5 border border-border text-foreground rounded-lg hover:bg-secondary transition-colors text-sm col-span-2"
          >
            <ExternalLink className="w-4 h-4" />
            View on Website
          </a>
          <Link
            to={`/admin/events/${event.event_id}/edit`}
            className="flex items-center justify-center gap-2 px-3 py-2.5 border border-green-500/50 text-green-500 rounded-lg hover:bg-secondary text-sm"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={handleDeleteClick}
            className="flex items-center justify-center gap-2 px-3 py-2.5 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Event Info Header */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Event Date</p>
            <p className="text-foreground font-medium">
              {event.event_date 
                ? new Date(event.event_date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })
                : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Event Time</p>
            <p className="text-foreground font-medium">
              {event.event_start_time?.slice(0, 5) || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Location</p>
            <p className="text-foreground font-medium">{event.location || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Event Type</p>
            <p className="text-foreground font-medium">{event.event_type || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              event.is_active ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
            }`}>
              {event.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Event Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Attendees</p>
          <p className="text-2xl text-foreground">{attendees.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Confirmed</p>
          <p className="text-2xl text-foreground">
            {attendees.filter(a => a.status === 'confirmed').length}
          </p>
        </div>
      </div>

      {/* Attendees Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border">
          <h2 className="text-lg sm:text-xl text-foreground">Attendees</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left px-6 py-4 text-sm text-foreground">Name</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Email</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">University</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Registration Date</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Status</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {attendees.map(attendee => (
                <tr key={attendee.registration_id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 text-foreground">
                    {`${attendee.jobseeker?.first_name || ''} ${attendee.jobseeker?.last_name || ''}`.trim() || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{attendee.jobseeker?.email || 'N/A'}</td>
                  <td className="px-6 py-4 text-muted-foreground">{attendee.jobseeker?.institution_name || 'N/A'}</td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(attendee.registered_at || attendee.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      attendee.status === 'confirmed'
                        ? 'bg-green-500/20 text-green-500'
                        : attendee.status === 'waitlist'
                        ? 'bg-yellow-500/20 text-yellow-500'
                        : 'bg-blue-500/20 text-blue-500'
                    }`}>
                      {attendee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedAttendeeId(attendee.registration_id)}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title="View profile"
                      >
                        <Eye className="w-4 h-4 text-foreground" />
                      </button>
                      <button
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Remove attendee"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={handleDeleteConfirm}
        title="Delete Event"
        message={event ? `Are you sure you want to delete "${event.title}"? This action cannot be undone.` : ''}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={3000}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
