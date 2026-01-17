import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Calendar, 
  BookOpen, 
  Users, 
  Building2,
  BarChart3,
  Plus,
  ArrowRight
} from 'lucide-react';
import { mockJobs, mockEvents, mockStudents, mockSocieties } from '../services/Admin/admin-analytics';

export default function AdminDashboard() {

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
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
          <Link
            to="/admin/jobs/new"
            className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-secondary transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-foreground font-medium">Post New Job</p>
              <p className="text-sm text-muted-foreground">Create job listing</p>
            </div>
          </Link>
          <Link
            to="/admin/events/new"
            className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-secondary transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-foreground font-medium">Create Event</p>
              <p className="text-sm text-muted-foreground">Schedule new event</p>
            </div>
          </Link>
          <Link
            to="/admin/resources/new"
            className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-secondary transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-foreground font-medium">Upload Resource</p>
              <p className="text-sm text-muted-foreground">Add new resource</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6 text-left">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-foreground">Recent Jobs</h2>
            <Link
              to="/admin/jobs"
              className="text-sm text-primary hover:opacity-80"
            >
              View all
            </Link>
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
            <Link
              to="/admin/events"
              className="text-sm text-primary hover:opacity-80"
            >
              View all
            </Link>
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
      {/* Management Sections */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/jobs"
          className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h3 className="text-xl text-foreground mb-2">Jobs</h3>
          <p className="text-sm text-muted-foreground">Manage job postings and applications</p>
        </Link>

        <Link
          to="/admin/events"
          className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h3 className="text-xl text-foreground mb-2">Events</h3>
          <p className="text-sm text-muted-foreground">Manage events and registrations</p>
        </Link>

        <Link
          to="/admin/resources"
          className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-teal-500 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h3 className="text-xl text-foreground mb-2">Resources</h3>
          <p className="text-sm text-muted-foreground">Manage downloadable resources</p>
        </Link>

        <Link
          to="/admin/students"
          className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h3 className="text-xl text-foreground mb-2">Students</h3>
          <p className="text-sm text-muted-foreground">View and manage student profiles</p>
        </Link>

        <Link
          to="/admin/societies"
          className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h3 className="text-xl text-foreground mb-2">Societies</h3>
          <p className="text-sm text-muted-foreground">Manage society information</p>
        </Link>

        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-xl text-foreground mb-2">Analytics</h3>
          <p className="text-sm text-muted-foreground mb-4">View detailed platform analytics</p>
          <button className="text-sm text-primary hover:opacity-80">Coming Soon</button>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}