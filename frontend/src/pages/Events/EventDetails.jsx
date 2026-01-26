import {useState, useEffect} from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Bookmark, BookmarkCheck, Share2, MapPin, Clock, Users, Calendar, Building, ExternalLink } from 'lucide-react';
import JobBadge from '../../components/Ui/JobBadge';
import CompanyLogo from '../../components/Ui/CompanyLogo';
import StructuredDescription from '../../components/Ui/StructuredDescription';
import LoadingSpinner from '../../components/Ui/LoadingSpinner';
import ErrorMessage from '../../components/Ui/ErrorMessage';
import { eventsService, eventActionsService } from '../../services';
import { generateEventTags } from '../../utils/tagGenerator';
import { formatTimeAgo } from '../../utils/timeFormatter';
import { useAuth } from '../../contexts/AuthContext';

export default function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn, isSociety, isJobseeker, isAdmin } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [savingEvent, setSavingEvent] = useState(false);

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      
      try {
        setLoading(true);
        setError(null);
        const eventData = await eventsService.getEventById(eventId);
        setEvent(eventData);
        
        // Check if event is saved/registered if user is logged in
        if (isLoggedIn() && user) {
          try {
            const saved = await eventActionsService.checkEventSaved(eventId, user.userId, user.userType);
            setIsSaved(saved);
            
            const registered = await eventActionsService.checkEventRegistered(eventId, user.userId, user.userType);
            setIsRegistered(registered);
          } catch (err) {
            console.error('Error checking event status:', err);
          }
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError(err.message || 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId, isLoggedIn, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                <svg 
                  className="w-12 h-12 text-muted-foreground" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-3 text-foreground">Event Not Found</h1>
              <p className="text-muted-foreground mb-8">
                {error || "The event you're looking for doesn't exist or has been removed. It may have been cancelled or the posting has expired."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                to="/events" 
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity font-medium"
              >
                Browse All Events
              </Link>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-border text-foreground rounded-xl hover:bg-secondary transition-colors font-medium"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    setSavingEvent(true);
    try {
      if (isSaved) {
        await eventActionsService.unsaveEvent(eventId, user.userId, user.userType);
        setIsSaved(false);
      } else {
        await eventActionsService.saveEvent(eventId, user.userId, user.userType);
        setIsSaved(true);
      }
      
      // Refetch saved status to ensure it's in sync with backend
      try {
        const saved = await eventActionsService.checkEventSaved(eventId, user.userId, user.userType);
        setIsSaved(saved);
      } catch (refetchErr) {
        console.error('Error refetching saved status:', refetchErr);
      }
    } catch (err) {
      console.error('Error saving event:', err);
    } finally {
      setSavingEvent(false);
    }
  };

  const handleRegister = async () => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    // Prevent societies from registering
    if (isSociety()) {
      alert('Societies cannot register for events. You can save events for your members.');
      return;
    }

    if (!event?.event_link) return;

    setIsRegistering(true);
    
    try {
      // If already registered, just redirect to event link
      if (isRegistered) {
        setTimeout(() => {
          window.open(event.event_link, '_blank');
          setIsRegistering(false);
        }, 500);
        return;
      }

      // Record registration in backend
      await eventActionsService.registerForEvent(eventId, user.userId, user.userType);
      setIsRegistered(true);
      
      // Show registering state before redirect
      if (event?.event_link) {
        setTimeout(() => {
          window.open(event.event_link, '_blank');
          setIsRegistering(false);
        }, 1500);
      }
    } catch (err) {
      // If 409 conflict (already registered), update state and redirect
      if (err.message?.includes('409') || err.message?.includes('Already registered')) {
        setIsRegistered(true);
        setTimeout(() => {
          window.open(event.event_link, '_blank');
          setIsRegistering(false);
        }, 500);
      } else {
        console.error('Error registering for event:', err);
        alert(err.message || 'Failed to register for event');
        setIsRegistering(false);
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-secondary/30">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                if (window.history.length > 1 && document.referrer) {
                  navigate(-1);
                } else {
                  navigate('/events');
                }
              }}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </button>

          </div>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 text-left">
            <div className="flex items-start gap-4">
              <CompanyLogo 
                logo={event.organiser_logo} 
                color={event.organiser_color || '#0D7DFF'} 
                companyName={event.organiser}
              />
              <div>
                <h1 className="text-3xl mb-2 text-foreground font-semibold">
                  {event.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    {event.organiser}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {event.event_start_time?.slice(0, 5)} - {event.event_end_time?.slice(0, 5)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {generateEventTags(event).map((tag, index) => (
                    <JobBadge
                      key={index}
                      variant={tag.variant}
                    >
                      {tag.label}
                    </JobBadge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 shrink-0">
              {isAdmin() && (
                <Link
                  to={`/admin/events/${event.event_id}/edit`}
                  className="px-4 py-2 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors flex items-center gap-2"
                >
                  <span className="text-sm font-medium">Edit Event</span>
                </Link>
              )}
              <button
                onClick={handleSave}
                disabled={savingEvent}
                className={`px-4 py-2 rounded-xl border transition-colors disabled:opacity-50 ${
                  isSaved
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-card border-border hover:border-primary/50'
                }`}
              >
                {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
              </button>
              <button 
                onClick={handleShare}
                className="px-4 py-2 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-8">
              <StructuredDescription description={event.description} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Register Card */}
              <div className="bg-card border border-border rounded-2xl p-6">
                {isRegistering ? (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-3">
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-foreground font-medium">Preparing registration...</p>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleRegister}
                      disabled={!event.event_link || isSociety()}
                      className={`w-full px-6 py-3 rounded-xl transition-opacity flex items-center justify-center gap-2 ${
                        isRegistered
                          ? 'bg-muted text-muted-foreground cursor-pointer hover:opacity-80'
                          : 'bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                    >
                      {isSociety() ? 'Societies Cannot Register' : isRegistered ? 'Registered' : 'Register Now'}
                      {!isSociety() && <ExternalLink className="w-4 h-4" />}
                    </button>
                    {event.event_link && (
                      <p className="text-xs text-muted-foreground text-center mt-3">
                        {isRegistered ? 'Click to view the registration page again' : "You'll be redirected to the event registration page"}
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Event Details */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <h3 className="text-foreground mb-4">Event Details</h3>
                
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground mb-0.5">Date & Time</div>
                    <div className="text-foreground">{new Date(event.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                    <div className="text-foreground">{event.event_start_time?.slice(0, 5)} - {event.event_end_time?.slice(0, 5)}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground mb-0.5">Location</div>
                    <div className="text-foreground">{event.location}</div>
                    {event.address && <div className="text-sm text-muted-foreground">{event.address}</div>}
                  </div>
                </div>

              </div>

              {/* Organiser Info */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-foreground mb-4">Organised By</h3>
                <div className="flex items-center gap-3 mb-4">
                  <CompanyLogo 
                    logo={event.organiser_logo} 
                    color={event.organiser_color || '#0D7DFF'} 
                    companyName={event.organiser}
                  />
                  <div>
                    <div className="text-foreground">{event.organiser || 'Unknown Organiser'}</div>
                    <div className="text-sm text-muted-foreground">Event Organiser</div>
                  </div>
                </div>
                {event.organiser_description && (
                  <p className="text-muted-foreground text-sm mb-4">
                    {event.organiser_description}
                  </p>
                )}
                {event.organiser_website && (
                  <a
                    href={event.organiser_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:opacity-80 text-sm flex items-center gap-1"
                  >
                    Visit website
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .prose h3 {
          color: var(--foreground);
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .prose p {
          color: var(--muted-foreground);
          margin-bottom: 1rem;
        }
        .prose ul {
          color: var(--muted-foreground);
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .prose li {
          margin-bottom: 0.5rem;
        }
      `}</style>

    </div>
  );
}