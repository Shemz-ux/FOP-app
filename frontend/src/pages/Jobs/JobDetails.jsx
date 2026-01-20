import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Bookmark, BookmarkCheck, Share2, MapPin, DollarSign, Users, Clock, Building, Calendar, ExternalLink } from 'lucide-react';
import JobBadge from '../../components/Ui/JobBadge';
import CompanyLogo from '../../components/Ui/CompanyLogo';
import StructuredDescription from '../../components/Ui/StructuredDescription';
import LoadingSpinner from '../../components/Ui/LoadingSpinner';
import ErrorMessage from '../../components/Ui/ErrorMessage';
import { jobsService, jobActionsService } from '../../services';
import { generateJobTags } from '../../utils/tagGenerator';
import { formatTimeAgo } from '../../utils/timeFormatter';
import { useAuth } from '../../contexts/AuthContext';

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn, isJobseeker, isSociety, isAdmin } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [savingJob, setSavingJob] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const data = await jobsService.getJobById(jobId);
        setJob(data);
        
        // Check if job is saved and applied
        if (isLoggedIn() && user) {
          const saved = await jobActionsService.checkJobSaved(jobId, user.userId, user.userType);
          setIsSaved(saved);
          
          // Check if already applied (jobseekers only)
          if (isJobseeker()) {
            const applied = await jobActionsService.checkJobApplied(jobId, user.userId);
            setHasApplied(applied);
          }
        }
      } catch (err) {
        console.error('Error fetching job:', err);
        setError(err.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [jobId, isLoggedIn, user, isJobseeker]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error || !job) {
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
              <h1 className="text-3xl font-bold mb-3 text-foreground">Job Not Found</h1>
              <p className="text-muted-foreground mb-8">
                {error || "The job you're looking for doesn't exist or has been removed. It may have been filled or the posting has expired."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                to="/jobs" 
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity font-medium"
              >
                Browse All Jobs
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

  const handleSave = async () => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    setSavingJob(true);
    try {
      if (isSaved) {
        await jobActionsService.unsaveJob(jobId, user.userId, user.userType);
        setIsSaved(false);
      } else {
        await jobActionsService.saveJob(jobId, user.userId, user.userType);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Error saving job:', err);
    } finally {
      setSavingJob(false);
    }
  };

  const handleApply = async () => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    // Prevent societies from applying
    if (isSociety()) {
      alert('Societies cannot apply to jobs. You can save jobs for your members.');
      return;
    }

    if (!job?.job_link) return;
    
    setIsApplying(true);
    
    try {
      // If already applied, just redirect to job link
      if (hasApplied) {
        setTimeout(() => {
          window.open(job.job_link, '_blank');
          setIsApplying(false);
        }, 500);
        return;
      }

      // Record application in backend
      await jobActionsService.applyToJob(jobId, user.userId);
      setHasApplied(true);
      
      // Show applying state before redirect
      setTimeout(() => {
        window.open(job.job_link, '_blank');
        setIsApplying(false);
      }, 1500);
    } catch (err) {
      // If 409 conflict (already applied), update state and redirect
      if (err.message?.includes('409') || err.message?.includes('Already applied')) {
        setHasApplied(true);
        setTimeout(() => {
          window.open(job.job_link, '_blank');
          setIsApplying(false);
        }, 500);
      } else {
        console.error('Error applying to job:', err);
        setIsApplying(false);
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job at ${job.company}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

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
              Back to Jobs
            </button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 text-left">
            <div className="flex items-start gap-4">
              <CompanyLogo 
                logo={job.company_logo} 
                color={job.company_color} 
                companyName={job.company}
              />
              <div>
                <h1 className="text-3xl mb-2 text-foreground font-semibold">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    {job.company}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatTimeAgo(job.created_at)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {generateJobTags(job).map((tag, index) => (
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
              {isAdmin() && (
                <Link
                  to={`/admin/jobs/${job.job_id}/edit`}
                  className="px-4 py-2 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className="hidden sm:inline">Edit</span>
                </Link>
              )}
              <button
                onClick={handleSave}
                disabled={savingJob}
                className={`px-4 py-2 rounded-xl border transition-colors disabled:opacity-50 ${
                  isSaved
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-card border-border hover:border-primary/50"
                }`}
              >
                {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
              </button>
              <button 
                onClick={handleShare}
                className="px-4 py-2 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors"
              >
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
            <div className="bg-card border border-border rounded-2xl p-8 job-description-content">
              <StructuredDescription description={job.description} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Apply Card */}
              <div className="bg-card border border-border rounded-2xl p-6">
                {isApplying ? (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-3">
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-foreground font-medium">
                      Preparing application...
                    </p>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleApply}
                      disabled={!job.job_link || isSociety()}
                      className={`w-full px-6 py-3 rounded-xl transition-opacity flex items-center justify-center gap-2 ${
                        hasApplied
                          ? 'bg-muted text-muted-foreground cursor-pointer hover:opacity-80'
                          : 'bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                    >
                      {isSociety() ? 'Societies Cannot Apply' : hasApplied ? 'Applied' : 'Apply Now'}
                      {!isSociety() && <ExternalLink className="w-4 h-4" />}
                    </button>
                    {job.job_link && (
                      <p className="text-xs text-muted-foreground text-center mt-3">
                        {hasApplied ? 'Click to view the application page again' : "You'll be redirected to the company website"}
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Job Details // TODO: Need to find a ways to add bullet point list */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <h3 className="text-foreground mb-4">Job Details</h3>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground mb-0.5">
                      Applicants
                    </div>
                    <div className="text-foreground">
                      {job.applicant_count || 0} candidate{job.applicant_count !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground mb-0.5">
                      Role Type
                    </div>
                    <div className="text-foreground">
                      {job.role_type}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground mb-0.5">
                      Work Type
                    </div>
                    <div className="text-foreground">
                      {job.work_type}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground mb-0.5">
                      Experience Level
                    </div>
                    <div className="text-foreground">
                      {job.experience_level}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground mb-0.5">
                      Application Deadline
                    </div>
                    <div className="text-foreground">
                      {job.deadline 
                        ? new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : 'Rolling Deadline'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Info */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-foreground font-medium mb-4">
                  About {job.company}
                </h3>
                <div className="flex items-center justify-center mb-4">
                  <CompanyLogo 
                    logo={job.company_logo} 
                    color={job.company_color} 
                    companyName={job.company}
                  />
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  {job.company_description || `${job.company} is committed to building innovative products and creating value.`}
                </p>
                {job.company_website && (
                  <a
                    href={job.company_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:opacity-80 text-sm flex items-center gap-1"
                  >
                    Visit company website
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .job-description-content ul {
          list-style-type: disc !important;
          margin-left: 1.5rem !important;
        }
        .job-description-content ul li {
          font-weight: 400 !important;
          font-size: 1rem !important;
          color: var(--muted-foreground) !important;
          line-height: 1.625 !important;
          margin-bottom: 0.375rem !important;
        }
        .job-description-content ul li::marker {
          color: var(--muted-foreground) !important;
        }
      `}</style>
    </div>
  );
}
