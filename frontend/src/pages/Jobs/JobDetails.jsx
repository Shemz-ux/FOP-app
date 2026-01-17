import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Bookmark, Share2, MapPin, DollarSign, Users, Clock, Building, Calendar } from 'lucide-react';
import JobBadge from '../../components/Ui/JobBadge';
import { mockJobDetails } from '../../services/Jobs/jobs';

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  // Find job by id in the array
  const job = jobId ? mockJobDetails.find(job => job.id === jobId) : null;

  if (!job) {
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
                The job you're looking for doesn't exist or has been removed. It may have been filled or the posting has expired.
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

  const handleApply = () => {
    setHasApplied(true);
    // In a real app, this would submit the application
  };

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

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 text-left">
            <div className="flex items-start gap-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center p-3 shrink-0"
                style={{ backgroundColor: `${job.companyColor}15` }}
              >
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl mb-2 text-foreground">
                  {job.jobTitle}
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
                    {job.postedDate} 
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, index) => (
                    <JobBadge
                      key={index}
                      label={tag.label}
                      variant={tag.variant}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`px-4 py-2 rounded-xl border transition-colors ${
                  isSaved
                    ? "bg-primary/10 border-primary text-primary"
                    : "border-border text-foreground hover:bg-secondary"
                }`}
              >
                <Bookmark
                  className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`}
                />
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
                dangerouslySetInnerHTML={{ __html: job.description }}
                style={{ color: "var(--foreground)" }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Apply Card */}
              <div className="bg-card border border-border rounded-2xl p-6">
                {hasApplied ? (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-3">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-foreground mb-1">
                      Application Submitted!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      We'll be in touch soon
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleApply}
                    className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Apply Now
                  </button>
                )}
              </div>

              {/* Job Details // TODO: Need to find a ways to add bullet point list */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <h3 className="text-foreground mb-4">Job Details</h3>

                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground mb-0.5">
                      Salary
                    </div>
                    <div className="text-foreground">{job.salary}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground mb-0.5">
                      Applicants
                    </div>
                    <div className="text-foreground">
                      {job.applicants} candidates
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground mb-0.5">
                      Employment Type
                    </div>
                    <div className="text-foreground">
                      {job.employmentType}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground mb-0.5">
                      Posted
                    </div>
                    <div className="text-foreground">
                      {job.postedDate}
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Info // TODO: Need to include way to get company profile */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-foreground mb-4">
                  About {job.company}
                </h3>
                <div
                  className="w-full h-16 rounded-xl flex items-center justify-center p-4 mb-4"
                  style={{ backgroundColor: `${job.companyColor}15` }}
                >
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  {job.company} is a leading technology company committed to
                  building innovative products that connect people and create
                  value.
                </p>
                <Link
                  to={`/company/${job.company.toLowerCase()}`}
                  className="text-primary hover:opacity-80 text-sm"
                >
                  View company profile →
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
