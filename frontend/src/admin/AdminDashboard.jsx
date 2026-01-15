import { useState } from "react";
import { 
  Briefcase, 
  Calendar, 
  BookOpen, 
  Users, 
  Building2,
  BarChart3,
  Plus
} from 'lucide-react';
import { mockJobs, mockEvents, mockStudents, mockSocieties } from '../services/Admin/admin-analytics';
import JobsManagement from './JobsManagement';
import EventsManagement from './EventsManagement';
import ResourcesManagement from './ResourcesManagement';
import StudentsManagement from './StudentsManagement';
import SocietiesManagement from './SocietiesManagement';
import { CreateJobForm, CreateEventForm, CreateResourceForm } from './adminForms';

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState('overview');
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showCreateResource, setShowCreateResource] = useState(false);

  const stats = {
    totalJobs: mockJobs.length,
    activeJobs: mockJobs.filter(j => j.status === 'active').length,
    totalEvents: mockEvents.length,
    upcomingEvents: mockEvents.filter(e => e.status === 'upcoming').length,
    totalStudents: mockStudents.length,
    totalSocieties: mockSocieties.length,
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl mb-1 text-foreground">{value}</h3>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-8 text-left">
      <div>
        <h1 className="text-3xl mb-2 text-foreground">Admin Dashboard</h1>
        {/* // TODO: Get user name from API */}
        <p className="text-muted-foreground">Welcome back John! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 text-left">
        <StatCard
          icon={Briefcase}
          title="Total Jobs"
          value={stats.totalJobs}
          subtitle={`${stats.activeJobs} active`}
          color="bg-blue-500"
        />
        <StatCard
          icon={Calendar}
          title="Events"
          value={stats.totalEvents}
          subtitle={`${stats.upcomingEvents} upcoming`}
          color="bg-purple-500"
        />
        <StatCard
          icon={Users}
          title="Students"
          value={stats.totalStudents}
          subtitle="Registered users"
          color="bg-green-500"
        />
        <StatCard
          icon={Building2}
          title="Societies"
          value={stats.totalSocieties}
          subtitle="Active societies"
          color="bg-orange-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-xl p-6 text-left">
        <h2 className="text-xl mb-4 text-foreground">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              setShowCreateJob(true);
              setCurrentView('jobs');
            }}
            className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-secondary transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-foreground font-medium">Post New Job</p>
              <p className="text-sm text-muted-foreground">Create job listing</p>
            </div>
          </button>
          <button
            onClick={() => {
              setShowCreateEvent(true);
              setCurrentView('events');
            }}
            className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-secondary transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-foreground font-medium">Create Event</p>
              <p className="text-sm text-muted-foreground">Schedule new event</p>
            </div>
          </button>
          <button
            onClick={() => {
              setShowCreateResource(true);
              setCurrentView('resources');
            }}
            className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-secondary transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-foreground font-medium">Upload Resource</p>
              <p className="text-sm text-muted-foreground">Add new resource</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6 text-left">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-foreground">Recent Jobs</h2>
            <button
              onClick={() => setCurrentView('jobs')}
              className="text-sm text-primary hover:opacity-80"
            >
              View all
            </button>
          </div>
          <div className="space-y-3">
            {mockJobs.slice(0, 3).map(job => (
              <div key={job.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="text-foreground font-medium">{job.title}</p>
                  <p className="text-sm text-muted-foreground">{job.company}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-primary">{job.applicants} applicants</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-foreground">Upcoming Events</h2>
            <button
              onClick={() => setCurrentView('events')}
              className="text-sm text-primary hover:opacity-80"
            >
              View all
            </button>
          </div>
          <div className="space-y-3">
            {mockEvents.slice(0, 3).map(event => (
              <div key={event.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="text-foreground font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-primary">{event.attendees} attendees</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Sidebar Navigation */}
        <div className="flex gap-8">
          <aside className="w-64 flex-shrink-0">
            <nav className="bg-card border border-border rounded-xl p-4 sticky top-24">
              <div className="space-y-1">
                <button
                  onClick={() => setCurrentView('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentView === 'overview'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  Overview
                </button>
                <button
                  onClick={() => setCurrentView('jobs')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentView === 'jobs' || currentView === 'job-detail' || currentView === 'create-job'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  <Briefcase className="w-5 h-5" />
                  Jobs
                </button>
                <button
                  onClick={() => setCurrentView('events')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentView === 'events' || currentView === 'event-detail' || currentView === 'create-event'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  Events
                </button>
                <button
                  onClick={() => setCurrentView('resources')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentView === 'resources' || currentView === 'create-resource'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  Resources
                </button>
                <button
                  onClick={() => setCurrentView('students')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentView === 'students'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  Students
                </button>
                <button
                  onClick={() => setCurrentView('societies')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentView === 'societies'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  Societies
                </button>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {currentView === 'overview' && renderOverview()}
            {currentView === 'jobs' && !showCreateJob && <JobsManagement />}
            {currentView === 'jobs' && showCreateJob && (
              <CreateJobForm onCancel={() => {
                setShowCreateJob(false);
                setCurrentView('jobs');
              }} />
            )}
            {currentView === 'events' && !showCreateEvent && <EventsManagement />}
            {currentView === 'events' && showCreateEvent && (
              <CreateEventForm onCancel={() => {
                setShowCreateEvent(false);
                setCurrentView('events');
              }} />
            )}
            {currentView === 'resources' && !showCreateResource && <ResourcesManagement />}
            {currentView === 'resources' && showCreateResource && (
              <CreateResourceForm onCancel={() => {
                setShowCreateResource(false);
                setCurrentView('resources');
              }} />
            )}
            {currentView === 'students' && <StudentsManagement />}
            {currentView === 'societies' && <SocietiesManagement />}
          </main>
        </div>
      </div>
    </div>
  );
}