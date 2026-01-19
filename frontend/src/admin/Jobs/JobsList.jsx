import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Eye, BarChart, Trash2, Edit, Home } from 'lucide-react';
import AdminSelect from '../Components/AdminSelect';
import { apiGet, apiDelete } from '../../services/api';

export default function JobsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await apiGet('/jobs');
        setJobs(data.jobs || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    
    try {
      await apiDelete(`/jobs/${jobId}`);
      setJobs(jobs.filter(job => job.job_id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = (job.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (job.company || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading jobs...</p>
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
        <span className="text-foreground">Jobs</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2 text-foreground">Job Management</h1>
          <p className="text-muted-foreground">Manage all job postings and applications</p>
        </div>
        <Link
          to="/admin/jobs/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          Post New Job
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search jobs by title or company..."
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
              { value: 'active', label: 'Active' },
              { value: 'closed', label: 'Closed' },
              { value: 'draft', label: 'Draft' }
            ]}
            className="w-full md:w-[180px]"
          />
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left px-6 py-4 text-sm text-foreground">Job Title</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Company</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Location</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Applicants</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Status</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredJobs.map(job => (
                <tr key={job.job_id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 text-foreground">{job.title}</td>
                  <td className="px-6 py-4 text-muted-foreground">{job.company}</td>
                  <td className="px-6 py-4 text-muted-foreground">{job.location || 'N/A'}</td>
                  <td className="px-6 py-4 text-muted-foreground">{job.applicant_count || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      job.is_active
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-red-500/20 text-red-500'
                    }`}>
                      {job.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/jobs/${job.job_id}`}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title="View details"
                      >
                        <BarChart className="w-4 h-4 text-foreground" />
                      </Link>
                      <Link
                        to={`/admin/jobs/${job.job_id}/edit`}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title="Edit job"
                      >
                        <Edit className="w-4 h-4 text-foreground" />
                      </Link>
                      <button
                        onClick={() => handleDelete(job.job_id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete job"
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
