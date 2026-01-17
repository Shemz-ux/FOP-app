import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Eye, Trash2 } from 'lucide-react';
import { ProfileView } from '../Components/ProfileView';
import { mockJobs, mockApplicants, mockApplicantProfiles } from '../../services/Admin/admin-analytics';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);

  const job = mockJobs.find(j => j.id === parseInt(id));

  // If viewing an applicant profile
  if (selectedApplicantId) {
    const profile = mockApplicantProfiles[selectedApplicantId];
    
    return <ProfileView profile={profile} onClose={() => setSelectedApplicantId(null)} type="applicant" />;
  }

  if (!job) {
    return (
      <div className="space-y-6 text-left">
        <button
          onClick={() => navigate('/admin/jobs')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Jobs</span>
        </button>
        <div className="text-center py-12">
          <h2 className="text-2xl text-foreground mb-2">Job Not Found</h2>
          <p className="text-muted-foreground">The job you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6 text-left">
      <button
        onClick={() => navigate('/admin/jobs')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Jobs</span>
      </button>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2 text-foreground">{job.title}</h1>
          <p className="text-muted-foreground">{job.company}</p>
        </div>
        <div className="flex gap-2">
          <a
            href={`/jobs/${job.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            <ExternalLink className="w-4 h-4" />
            View on Website
          </a>
          <Link
            to={`/admin/jobs/${job.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary"
          >
            Edit Job
          </Link>
        </div>
      </div>

      {/* Job Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Applicants</p>
          <p className="text-2xl text-foreground">{job.applicants}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
          <p className="text-2xl text-foreground">28</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Shortlisted</p>
          <p className="text-2xl text-foreground">12</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Reviewed</p>
          <p className="text-2xl text-foreground">5</p>
        </div>
      </div>

      {/* Applicants Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-xl text-foreground">Applicants</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left px-6 py-4 text-sm text-foreground">Name</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Email</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">University</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Applied Date</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Status</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockApplicants.map(applicant => (
                <tr key={applicant.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 text-foreground">{applicant.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{applicant.email}</td>
                  <td className="px-6 py-4 text-muted-foreground">{applicant.university}</td>
                  <td className="px-6 py-4 text-muted-foreground">{applicant.appliedDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      applicant.status === 'shortlisted'
                        ? 'bg-green-500/20 text-green-500'
                        : applicant.status === 'reviewed'
                        ? 'bg-blue-500/20 text-blue-500'
                        : 'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {applicant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedApplicantId(applicant.id)}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title="View profile"
                      >
                        <Eye className="w-4 h-4 text-foreground" />
                      </button>
                      <button
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Reject application"
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
