import { useState } from 'react';
import { Search, Plus, Eye, Mail, Trash2, X, Edit, ExternalLink } from 'lucide-react';
import { CreateEventForm, EditEventForm } from './adminForms';
import { mockEvents, mockAttendees, mockAttendeeProfiles } from '../services/Admin/admin-analytics';

export default function EventsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedAttendeeId, setSelectedAttendeeId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (showCreateForm) {
    return <CreateEventForm onCancel={() => setShowCreateForm(false)} />;
  }

  if (editingEventId) {
    const eventToEdit = mockEvents.find(e => e.id === editingEventId);
    return <EditEventForm event={eventToEdit} onCancel={() => setEditingEventId(null)} />;
  }

  // Show attendee profile view
  if (selectedAttendeeId) {
    const profile = mockAttendeeProfiles[selectedAttendeeId];
    if (!profile) return null;

    return (
      <div className="space-y-6 text-left">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedAttendeeId(null)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-3xl mb-2 text-foreground">{profile.name}</h1>
            <p className="text-muted-foreground">{profile.course} at {profile.university}</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl mb-4 text-foreground">Contact Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-foreground">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="text-foreground">{profile.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">LinkedIn</p>
                <a href={`https://${profile.linkedIn}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:opacity-80">
                  {profile.linkedIn}
                </a>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl mb-4 text-foreground">Academic Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">University</p>
                <p className="text-foreground">{profile.university}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Course</p>
                <p className="text-foreground">{profile.course}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Year</p>
                <p className="text-foreground">{profile.year}</p>
              </div>
            </div>
          </div>

          {/* Registration Status */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl mb-4 text-foreground">Registration Status</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Registered Date</p>
                <p className="text-foreground">{profile.registeredDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  profile.status === 'confirmed'
                    ? 'bg-green-500/20 text-green-500'
                    : 'bg-yellow-500/20 text-yellow-500'
                }`}>
                  {profile.status}
                </span>
              </div>
            </div>
          </div>

          {/* Event Requirements */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl mb-4 text-foreground">Event Requirements</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Dietary Requirements</p>
                <p className="text-foreground">{profile.dietaryRequirements}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Accessibility</p>
                <p className="text-foreground">{profile.accessibility}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl mb-4 text-foreground">Career Interests</h2>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest, index) => (
              <span key={index} className="px-3 py-1 bg-secondary text-foreground rounded-full text-sm">
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Previous Events */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl mb-4 text-foreground">Previous Events Attended</h2>
          {profile.previousEvents.length > 0 ? (
            <div className="space-y-2">
              {profile.previousEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <p className="text-foreground">{event}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No previous events attended</p>
          )}
        </div>

        {/* Questions */}
        {profile.questions && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl mb-4 text-foreground">Questions/Notes</h2>
            <p className="text-foreground">{profile.questions}</p>
          </div>
        )}
      </div>
    );
  }

  if (selectedEventId) {
    const event = mockEvents.find(e => e.id === selectedEventId);
    if (!event) return null;

    return (
      <div className="space-y-6 text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedEventId(null)}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-3xl mb-2 text-foreground">{event.title}</h1>
              <p className="text-muted-foreground">{event.organizer}</p>
            </div>
          </div>
          <a
            href={`/events/${event.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            <ExternalLink className="w-4 h-4" />
            View on Website
          </a>
        </div>

        {/* Event Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Attendees</p>
            <p className="text-2xl text-foreground">{event.attendees}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Confirmed</p>
            <p className="text-2xl text-foreground">135</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Waitlist</p>
            <p className="text-2xl text-foreground">15</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Event Date</p>
            <p className="text-2xl text-foreground">{event.date.split('-')[2]}</p>
          </div>
        </div>

        {/* Attendees Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-xl text-foreground">Registered Attendees</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left px-6 py-4 text-sm text-foreground">Name</th>
                  <th className="text-left px-6 py-4 text-sm text-foreground">Email</th>
                  <th className="text-left px-6 py-4 text-sm text-foreground">University</th>
                  <th className="text-left px-6 py-4 text-sm text-foreground">Registered Date</th>
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
                    <td className="px-6 py-4 text-muted-foreground">{attendee.registeredDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        attendee.status === 'confirmed'
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-yellow-500/20 text-yellow-500'
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
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                          title="Delete attendee"
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
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2 text-foreground">Event Management</h1>
          <p className="text-muted-foreground">Manage all events and registrations</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search events by title or organizer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left px-6 py-4 text-sm text-foreground">Event Title</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Organiser</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Attendees</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Date</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Status</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEvents.map(event => (
                <tr key={event.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 text-foreground">{event.title}</td>
                  <td className="px-6 py-4 text-muted-foreground">{event.organizer}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedEventId(event.id)}
                      className="text-primary hover:opacity-80 font-medium"
                    >
                      {event.attendees} attendees
                    </button>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{event.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      event.status === 'upcoming'
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-gray-500/20 text-gray-500'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedEventId(event.id)}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4 text-foreground" />
                      </button>
                      <button
                        onClick={() => setEditingEventId(event.id)}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title="Edit event"
                      >
                        <Edit className="w-4 h-4 text-foreground" />
                      </button>
                      <button
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title="Delete event"
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
  );
}
