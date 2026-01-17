import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Eye, Trash2 } from 'lucide-react';
import { ProfileView } from '../Components/ProfileView';
import { mockEvents, mockAttendees, mockAttendeeProfiles } from '../../services/Admin/admin-analytics';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedAttendeeId, setSelectedAttendeeId] = useState(null);

  const event = mockEvents.find(e => e.id === parseInt(id));

  // If viewing an attendee profile
  if (selectedAttendeeId) {
    const profile = mockAttendeeProfiles[selectedAttendeeId];
    
    return <ProfileView profile={profile} onClose={() => setSelectedAttendeeId(null)} type="attendee" />;
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
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6 text-left">
      <button
        onClick={() => navigate('/admin/events')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Events</span>
      </button>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2 text-foreground">{event.title}</h1>
          <p className="text-muted-foreground">{event.organizer}</p>
        </div>
        <div className="flex gap-2">
          <a
            href={`/events/${event.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            <ExternalLink className="w-4 h-4" />
            View on Website
          </a>
          <Link
            to={`/admin/events/${event.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary"
          >
            Edit Event
          </Link>
        </div>
      </div>

      {/* Event Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Attendees</p>
          <p className="text-2xl text-foreground">{event.attendees}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Confirmed</p>
          <p className="text-2xl text-foreground">42</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Waitlist</p>
          <p className="text-2xl text-foreground">8</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Capacity</p>
          <p className="text-2xl text-foreground">100</p>
        </div>
      </div>

      {/* Attendees Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-xl text-foreground">Attendees</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
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
              {mockAttendees.map(attendee => (
                <tr key={attendee.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 text-foreground">{attendee.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{attendee.email}</td>
                  <td className="px-6 py-4 text-muted-foreground">{attendee.university}</td>
                  <td className="px-6 py-4 text-muted-foreground">{attendee.registrationDate}</td>
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
                        onClick={() => setSelectedAttendeeId(attendee.id)}
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
    </div>
  );
}
