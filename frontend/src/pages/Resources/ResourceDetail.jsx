import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Download, FileText, BookOpen, File, Share2, Clock, User, Calendar, Eye } from 'lucide-react';
import JobBadge from '../../components/Ui/JobBadge';
import StructuredDescription from '../../components/Ui/StructuredDescription';
import LoadingSpinner from '../../components/Ui/LoadingSpinner';
import ErrorMessage from '../../components/Ui/ErrorMessage';
import { resourcesService } from '../../services';
import { RESOURCE_CATEGORIES } from '../../utils/dropdownOptions';
import { formatTimeAgo } from '../../utils/timeFormatter';
import { useAuth } from '../../contexts/AuthContext';

const iconMap = {
  FileText: FileText,
  BookOpen: BookOpen,
  File: File,
};

export default function ResourceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await resourcesService.getResourceById(id);
        setResource(data);
      } catch (err) {
        console.error('Error fetching resource:', err);
        setError(err.message || 'Failed to load resource');
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [id]);

  const handleDownload = async () => {
    try {
      const downloadUrl = await resourcesService.downloadResource(id);
      window.open(downloadUrl, '_blank');
    } catch (err) {
      console.error('Error downloading resource:', err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: resource.title,
        text: resource.description,
        url: window.location.href,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl mb-4 text-foreground">Resource Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The resource you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  const categoryInfo = RESOURCE_CATEGORIES.find(c => c.value === resource.category);
  const IconComponent = iconMap[categoryInfo?.icon] || FileText;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <button
          onClick={() => navigate('/resources')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Resources</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/10 text-primary border border-primary/20">
                  <IconComponent className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl mb-3 text-foreground text-left">{resource.title}</h1>
                  <div className="flex flex-wrap items-center gap-2 text-muted-foreground mb-3 text-left">
                    <span className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {resource.download_count?.toLocaleString() || 0} downloads
                    </span>
                    {resource.created_at && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTimeAgo(resource.created_at)}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <JobBadge variant={categoryInfo?.variant || 'gray'}>
                      {resource.category}
                    </JobBadge>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground text-lg leading-relaxed text-left">
                {resource.description}
              </p>
            </div>

            {/* Detailed Description */}
            {resource.detailed_description && (
              <div className="bg-card border border-border rounded-2xl p-8 text-left">
                <h2 className="text-2xl mb-4 text-foreground text-left">About This Resource</h2>
                <StructuredDescription description={resource.detailed_description} />
              </div>
            )}

            {/* What's Included */}
            {resource.whats_included && (
              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-2xl mb-4 text-foreground text-left">What's Included</h2>
                <ul className="space-y-3 text-left">
                  {resource.whats_included.split('\n').filter(line => line.trim()).map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-foreground">{item.replace(/^[•\-]\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Download Card */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="space-y-4">
                <div className="text-left">
                  <p className="text-sm text-muted-foreground mb-1">File Size</p>
                  <p className="text-foreground font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {resource.file_size}
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground mb-1">File Type</p>
                  <p className="text-foreground font-medium flex items-center gap-2">
                    <IconComponent className="w-4 h-4" />
                    {resource.file_type}
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground mb-1">Downloads</p>
                  <p className="text-foreground font-medium flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    {resource.download_count?.toLocaleString() || 0}
                  </p>
                </div>

                <div className="pt-4 border-t border-border space-y-3">
                  {isAdmin() && (
                    <Link
                      to={`/admin/resources/${resource.resource_id}/edit`}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-xl hover:bg-secondary transition-colors"
                    >
                      <span className="text-sm font-medium">Edit Resource</span>
                    </Link>
                  )}
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
                  >
                    {resource.file_type?.toLowerCase().includes('video') || resource.file_type === 'video/link' || resource.storage_url?.includes('youtube.com') || resource.storage_url?.includes('vimeo.com') || resource.storage_url?.includes('youtu.be') ? (
                      <>
                        <Eye className="w-5 h-5" />
                        Watch Video
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        Download Resource
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-xl hover:bg-secondary transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                </div>
              </div>
            </div>

            {/* Resource Info */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg mb-4 text-foreground text-left">Resource Information</h3>
              <div className="space-y-4 text-left">
                {resource.uploaded_by && (
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Uploaded By</p>
                      <p className="text-foreground">{resource.uploaded_by}</p>
                    </div>
                  </div>
                )}
                {resource.created_at && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground">Upload Date</p>
                      <p className="text-foreground">{new Date(resource.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                )}
                {resource.updated_at && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p className="text-foreground">{new Date(resource.updated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6">
              <h3 className="text-lg mb-2 text-foreground text-left">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4 text-left">
                Have questions about this resource? Our team is here to help.
              </p>
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
