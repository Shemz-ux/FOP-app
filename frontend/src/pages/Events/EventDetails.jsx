import {useState} from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Bookmark, Share2, MapPin, Clock, Users, Calendar } from 'lucide-react';
import JobBadge from '../../components/Ui/JobBadge';
import { mockEventDetails } from '../../services/Events/events';

export default function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const event = eventId ? mockEventDetails.find(event => event.id === eventId) : null;

  if (!event) {
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
                The event you're looking for doesn't exist or has been removed. It may have been filled or the posting has expired.
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
    setIsRegistered(true);
    // In a real app, this would submit the registration
  };

  const spotsLeft = event.capacity - event.attendees;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-secondary/30">
        <div className="container mx-auto px-6 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* Hero Image */}
          <div className="mb-6 rounded-2xl overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-64 lg:h-96 object-cover"
            />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 text-left">
            <div>
              <h1 className="text-3xl mb-3 text-foreground">{event.title}</h1>
              <div className="flex flex-wrap items-center gap-2 text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {event.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {event.time}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <JobBadge key={index} label={tag.label} variant={tag.variant} />
                ))}
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
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: event.description }}
                style={{
                  color: 'var(--foreground)',
                }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Register Card */}
              <div className="bg-card border border-border rounded-2xl p-6">
                {isRegistered ? (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-foreground mb-1">You're Registered!</p>
                    <p className="text-sm text-muted-foreground">Check your email for details</p>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleRegister}
                      className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity mb-3"
                    >
                      Register Now
                    </button>
                    {spotsLeft > 0 && spotsLeft < 50 && (
                      <p className="text-sm text-orange-400 text-center">
                        Only {spotsLeft} spots left!
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
                    <div className="text-foreground">{event.date}</div>
                    <div className="text-foreground">{event.time}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground mb-0.5">Location</div>
                    <div className="text-foreground">{event.location}</div>
                    <div className="text-sm text-muted-foreground">{event.address}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground mb-0.5">Attendees</div>
                    <div className="text-foreground">{event.attendees} registered</div>
                    <div className="text-sm text-muted-foreground">{event.capacity} capacity</div>
                  </div>
                </div>
              </div>

              {/* Organizer Info */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-foreground mb-4">Organized By</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                    {event.organizer.charAt(0)}
                  </div>
                  <div>
                    <div className="text-foreground">{event.organizer}</div>
                    <div className="text-sm text-muted-foreground">Event Organizer</div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  {event.organizer} is dedicated to creating valuable networking and learning opportunities for professionals in the tech industry.
                </p>
                <Link
                  to={`/organizer/${event.organizer.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-primary hover:opacity-80 text-sm"
                >
                  View more events →
                </Link>
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