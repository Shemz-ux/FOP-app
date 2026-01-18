import {useState, useEffect} from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Bookmark, Share2, MapPin, Clock, Users, Calendar, Building, ExternalLink } from 'lucide-react';
import JobBadge from '../../components/Ui/JobBadge';
import CompanyLogo from '../../components/Ui/CompanyLogo';
import StructuredDescription from '../../components/Ui/StructuredDescription';
import LoadingSpinner from '../../components/Ui/LoadingSpinner';
import ErrorMessage from '../../components/Ui/ErrorMessage';
import { eventsService } from '../../services';
import { generateEventTags } from '../../utils/tagGenerator';
import { formatTimeAgo } from '../../utils/timeFormatter';

export default function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      
      try {
        setLoading(true);
        setError(null);
        const eventData = await eventsService.getEventById(eventId);
        setEvent(eventData);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError(err.message || 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

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

  const handleRegister = () => {
    setIsRegistering(true);
    
    setTimeout(() => {
      setIsRegistered(true);
      if (event?.event_link) {
        setTimeout(() => {
          window.open(event.event_link, '_blank');
        }, 1500);
      }
    }, 1000);
  };

  const spotsLeft = event.capacity ? (event.capacity - (event.attendees || 0)) : null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-secondary/30">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
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
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`px-4 py-2 rounded-xl border transition-colors ${
                  isSaved
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'border-border text-foreground hover:bg-secondary'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
              <button className="px-4 py-2 rounded-xl border border-border text-foreground hover:bg-secondary transition-colors">
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
                {isRegistered ? (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-foreground font-medium mb-1">Redirecting you...</p>
                    <p className="text-sm text-muted-foreground">You'll be directed to the event registration page</p>
                  </div>
                ) : isRegistering ? (
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
                      className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mb-3"
                    >
                      Register Now
                      {event.event_link && <ExternalLink className="w-4 h-4" />}
                    </button>
                    {event.event_link && (
                      <p className="text-xs text-muted-foreground text-center mb-3">
                        You'll be redirected to the event page
                      </p>
                    )}
                    {event.capacity && (
                      <p className="text-sm text-muted-foreground text-center">
                        {event.capacity - (event.attendee_count || 0)} spots remaining
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

                {event.capacity && (
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground mb-0.5">Capacity</div>
                      <div className="text-foreground">{event.attendee_count || 0} / {event.capacity} registered</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Organizer Info */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-foreground mb-4">Organized By</h3>
                <div className="flex items-center gap-3 mb-4">
                  <CompanyLogo 
                    logo={event.organiser_logo} 
                    color={event.organiser_color || '#0D7DFF'} 
                    companyName={event.organiser}
                  />
                  <div>
                    <div className="text-foreground">{event.organiser || 'Unknown Organizer'}</div>
                    <div className="text-sm text-muted-foreground">Event Organizer</div>
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