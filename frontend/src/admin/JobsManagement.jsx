import { useState } from 'react';
import { Search, Plus, Eye, Mail, Trash2, X, Edit, ExternalLink } from 'lucide-react';
import { CreateJobForm, EditJobForm } from './adminForms';
import { mockJobs, mockApplicants, mockApplicantProfiles } from '../services/Admin/admin-analytics';

export default function JobsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (showCreateForm) {
    return <CreateJobForm onCancel={() => setShowCreateForm(false)} />;
  }

  if (editingJobId) {
    const jobToEdit = mockJobs.find(j => j.id === editingJobId);
    return <EditJobForm job={jobToEdit} onCancel={() => setEditingJobId(null)} />;
  }

  // Show applicant profile view
  if (selectedApplicantId) {
    const profile = mockApplicantProfiles[selectedApplicantId];
    if (!profile) return null;

    return (
      <div className="space-y-6 text-left">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedApplicantId(null)}
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
              {profile.github && (
                <div>
                  <p className="text-sm text-muted-foreground">GitHub</p>
                  <a href={`https://${profile.github}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:opacity-80">
                    {profile.github}
                  </a>
                </div>
              )}
              {profile.portfolio && (
                <div>
                  <p className="text-sm text-muted-foreground">Portfolio</p>
                  <a href={`https://${profile.portfolio}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:opacity-80">
                    {profile.portfolio}
                  </a>
                </div>
              )}
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
              <div>
                <p className="text-sm text-muted-foreground">Expected Graduation</p>
                <p className="text-foreground">{profile.graduationDate}</p>
              </div>
            </div>
          </div>

          {/* Application Status */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl mb-4 text-foreground">Application Status</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Applied Date</p>
                <p className="text-foreground">{profile.appliedDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  profile.status === 'shortlisted'
                    ? 'bg-green-500/20 text-green-500'
                    : profile.status === 'reviewed'
                    ? 'bg-blue-500/20 text-blue-500'
                    : 'bg-yellow-500/20 text-yellow-500'
                }`}>
                  {profile.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">CV</p>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
                  Download CV
                </button>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl mb-4 text-foreground">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-secondary text-foreground rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl mb-4 text-foreground">Experience</h2>
          <div className="space-y-4">
            {profile.experience.map((exp, index) => (
              <div key={index} className="border-l-2 border-primary pl-4">
                <h3 className="text-lg text-foreground">{exp.title}</h3>
                <p className="text-sm text-muted-foreground">{exp.company} • {exp.period}</p>
                <p className="text-foreground mt-2">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl mb-4 text-foreground">Education</h2>
          <div className="space-y-4">
            {profile.education.map((edu, index) => (
              <div key={index} className="border-l-2 border-primary pl-4">
                <h3 className="text-lg text-foreground">{edu.degree}</h3>
                <p className="text-sm text-muted-foreground">{edu.institution} • {edu.period}</p>
                <p className="text-foreground mt-2">{edu.grade}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cover Letter */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl mb-4 text-foreground">Cover Letter</h2>
          <p className="text-foreground">{profile.coverLetter}</p>
        </div>
      </div>
    );
  }

  if (selectedJobId) {
    const job = mockJobs.find(j => j.id === selectedJobId);
    if (!job) return null;

    return (
      <div className="space-y-6 text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedJobId(null)}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-3xl mb-2 text-foreground">{job.title}</h1>
              <p className="text-muted-foreground">{job.company}</p>
            </div>
          </div>
          <a
            href={`/jobs/${job.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            <ExternalLink className="w-4 h-4" />
            View on Website
          </a>
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
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                          title="Delete applicant"
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
          <h1 className="text-3xl mb-2 text-foreground">Job Management</h1>
          <p className="text-muted-foreground">Manage all job postings and applications</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          Post New Job
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search jobs by title or company..."
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
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
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
                <th className="text-left px-6 py-4 text-sm text-foreground">Applicants</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Posted</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Status</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredJobs.map(job => (
                <tr key={job.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 text-foreground">{job.title}</td>
                  <td className="px-6 py-4 text-muted-foreground">{job.company}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedJobId(job.id)}
                      className="text-primary hover:opacity-80 font-medium"
                    >
                      {job.applicants} applicants
                    </button>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{job.posted}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      job.status === 'active'
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-gray-500/20 text-gray-500'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedJobId(job.id)}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4 text-foreground" />
                      </button>
                      <button
                        onClick={() => setEditingJobId(job.id)}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title="Edit job"
                      >
                        <Edit className="w-4 h-4 text-foreground" />
                      </button>
                      <button
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
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
  );
}
