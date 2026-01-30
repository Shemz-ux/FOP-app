import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Eye, Trash2, Pencil, Download } from 'lucide-react';
import { ProfileView } from '../Components/ProfileView';
import ConfirmModal from '../../components/Ui/ConfirmModal';
import Toast from '../../components/Ui/Toast';
import { apiGet, apiDelete } from '../../services/api';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false });
  const [toast, setToast] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await apiGet(`/jobs/${id}`);
        console.log('Job API response:', response);
        const jobData = response.job || response;
        console.log('Job data:', jobData);
        setJob(jobData);
        
        // Fetch applicants for this job
        try {
          const applicantsData = await apiGet(`/jobs/${id}/applications`);
          console.log('Applicants data:', applicantsData);
          setApplicants(applicantsData.applications || []);
        } catch (appError) {
          console.error('Error fetching applicants:', appError);
          setApplicants([]);
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobDetails();
  }, [id]);

  const handleDeleteClick = () => {
    setConfirmModal({ isOpen: true });
  };

  const handleDeleteConfirm = async () => {
    try {
      await apiDelete(`/jobs/${job.job_id}`);
      setToast({
        message: `"${job.title}" has been deleted successfully`,
        type: 'success'
      });
      setTimeout(() => {
        navigate('/admin/jobs');
      }, 1500);
    } catch (error) {
      console.error('Error deleting job:', error);
      setToast({
        message: 'Failed to delete job. Please try again.',
        type: 'error'
      });
    }
  };

  const handleExportCSV = async () => {
    if (applicants.length === 0) {
      setToast({
        message: 'No applicants to export',
        type: 'error'
      });
      return;
    }

    try {
      setIsExporting(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}/jobs/${id}/applications/export`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to export CSV');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Extract filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      console.log('Content-Disposition header:', contentDisposition);
      
      let filename = 'applicants.csv';
      if (contentDisposition) {
        // Try multiple patterns to extract filename
        let filenameMatch = contentDisposition.match(/filename\s*=\s*"([^"]+)"/);
        if (!filenameMatch) {
          filenameMatch = contentDisposition.match(/filename\s*=\s*([^;]+)/);
        }
        
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].trim().replace(/^["']|["']$/g, '');
          console.log('Extracted filename:', filename);
        } else {
          console.log('Failed to extract filename, using default');
        }
      } else {
        console.log('No Content-Disposition header found');
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setToast({
        message: 'Applicant data exported successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Error exporting CSV:', error);
      setToast({
        message: 'Failed to export applicant data. Please try again.',
        type: 'error'
      });
    } finally {
      setIsExporting(false);
    }
  };

  // If viewing an applicant profile
  if (selectedApplicantId) {
    const applicant = applicants.find(a => a.application_id === selectedApplicantId);
    const profile = applicant ? {
      name: `${applicant.jobseeker?.first_name || ''} ${applicant.jobseeker?.last_name || ''}`.trim(),
      email: applicant.jobseeker?.email || 'N/A',
      phone: applicant.jobseeker?.phone_number || 'N/A',
      university: applicant.jobseeker?.institution_name || 'N/A',
      course: applicant.jobseeker?.area_of_study || 'N/A',
      year: applicant.jobseeker?.uni_year || 'N/A',
      cvData: applicant.jobseeker?.cv_storage_key ? {
        cv_file_name: applicant.jobseeker.cv_file_name,
        cv_file_size: applicant.jobseeker.cv_file_size,
        cv_storage_key: applicant.jobseeker.cv_storage_key,
        cv_storage_url: applicant.jobseeker.cv_storage_url,
        cv_uploaded_at: applicant.jobseeker.cv_uploaded_at
      } : null
    } : null;
    
    return <ProfileView profile={profile} onClose={() => setSelectedApplicantId(null)} type="applicant" />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading job details...</p>
        </div>
      </div>
    );
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
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-7xl">
        <div className="space-y-4 sm:space-y-6 text-left">
      <button
        onClick={() => navigate('/admin/jobs')}
        className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors mb-2 sm:mb-4"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>Back to Jobs</span>
      </button>
      
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl mb-2 text-foreground">{job.title}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">{job.company}</p>
        </div>
        
        {/* Desktop Button Layout */}
        <div className="hidden sm:flex gap-2 flex-wrap">
          <a
            href={`/jobs/${job.job_id}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              // Open in new tab and navigate to jobs listing if no referrer
              window.open(`/jobs/${job.job_id}`, '_blank');
              e.preventDefault();
            }}
            className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-secondary transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            View on Website
          </a>
          <Link
            to={`/admin/jobs/${job.job_id}/edit`}
            className="flex items-center gap-2 px-4 py-2 border border-green-500/50 text-green-500 rounded-lg hover:bg-secondary text-sm"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={handleDeleteClick}
            className="flex items-center gap-2 px-4 py-2 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
        
        {/* Mobile Button Layout */}
        <div className="sm:hidden grid grid-cols-2 gap-2">
          <a
            href={`/jobs/${job.job_id}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              // Open in new tab and navigate to jobs listing if no referrer
              window.open(`/jobs/${job.job_id}`, '_blank');
              e.preventDefault();
            }}
            className="flex items-center justify-center gap-2 px-3 py-2.5 border border-border text-foreground rounded-lg hover:bg-secondary transition-colors text-sm col-span-2"
          >
            <ExternalLink className="w-4 h-4" />
            View on Website
          </a>
          <Link
            to={`/admin/jobs/${job.job_id}/edit`}
            className="flex items-center justify-center gap-2 px-3 py-2.5 border border-green-500/50 text-green-500 rounded-lg hover:bg-secondary text-sm"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={handleDeleteClick}
            className="flex items-center justify-center gap-2 px-3 py-2.5 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Job Info Header */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Industry</p>
            <p className="text-foreground font-medium">{job.industry || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Location</p>
            <p className="text-foreground font-medium">{job.location || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Deadline</p>
            <p className="text-foreground font-medium">
              {job.deadline 
                ? new Date(job.deadline).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })
                : 'Rolling Deadline'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Role Type</p>
            <p className="text-foreground font-medium">{job.role_type || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Work Type</p>
            <p className="text-foreground font-medium">{job.work_type || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Status</p>
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
              job.is_active
                ? 'bg-green-500/20 text-green-500'
                : 'bg-red-500/20 text-red-500'
            }`}>
              {job.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Job Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Applicants</p>
          <p className="text-2xl text-foreground">{applicants.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
          <p className="text-2xl text-foreground">
            {applicants.filter(a => a.status === 'pending' || !a.status).length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Shortlisted</p>
          <p className="text-2xl text-foreground">
            {applicants.filter(a => a.status === 'shortlisted').length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Reviewed</p>
          <p className="text-2xl text-foreground">
            {applicants.filter(a => a.status === 'reviewed').length}
          </p>
        </div>
      </div>

      {/* Applicants Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <h2 className="text-lg sm:text-xl text-foreground">Applicants</h2>
          <button
            onClick={handleExportCSV}
            disabled={isExporting || applicants.length === 0}
            className="group relative flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:active:scale-100 shadow-sm hover:shadow-md text-sm font-medium min-w-[44px]"
            title={isExporting ? 'Exporting...' : 'Export to CSV'}
          >
            <Download className={`w-4 h-4 flex-shrink-0 transition-transform ${isExporting ? 'animate-bounce' : 'group-hover:scale-110'}`} />
            <span className="hidden sm:inline whitespace-nowrap">{isExporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left px-6 py-4 text-sm text-foreground">Name</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Email</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Institution</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Applied Date</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Status</th>
                <th className="text-left px-6 py-4 text-sm text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {applicants.map(applicant => (
                <tr key={applicant.application_id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 text-foreground">
                    {`${applicant.jobseeker?.first_name || ''} ${applicant.jobseeker?.last_name || ''}`.trim() || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{applicant.jobseeker?.email || 'N/A'}</td>
                  <td className="px-6 py-4 text-muted-foreground">{applicant.jobseeker?.institution_name || 'N/A'}</td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(applicant.applied_at || applicant.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      applicant.status === 'shortlisted'
                        ? 'bg-green-500/20 text-green-500'
                        : applicant.status === 'reviewed'
                        ? 'bg-blue-500/20 text-blue-500'
                        : 'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {applicant.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedApplicantId(applicant.application_id)}
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

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={handleDeleteConfirm}
        title="Delete Job"
        message={job ? `Are you sure you want to delete "${job.title}"? This will permanently remove the job and all associated applications. This action cannot be undone.` : ''}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={3000}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
