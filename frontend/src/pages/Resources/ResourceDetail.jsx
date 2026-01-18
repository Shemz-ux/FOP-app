import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Download, Eye, Calendar, User, FileText, BookOpen, File, Share2 } from 'lucide-react';
import StructuredDescription from '../../components/Ui/StructuredDescription';
import { mockResources } from '../../services/Resources/resources';

const iconMap = {
  FileText: FileText,
  BookOpen: BookOpen,
  File: File,
};

export default function ResourceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResource = async () => {
      setLoading(true);
      const foundResource = mockResources.find(r => r.id === parseInt(id));
      
      if (foundResource) {
        setResource(foundResource);
      }
      setLoading(false);
    };

    fetchResource();
  }, [id]);

  const handleDownload = () => {
    console.log('Download resource:', resource.title);
  };

  const handleShare = () => {
    console.log('Share resource:', resource.title);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading resource...</p>
        </div>
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

  const IconComponent = iconMap[resource.iconType] || FileText;
  const categoryColors = {
    purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    green: 'bg-green-500/10 text-green-500 border-green-500/20',
    orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    pink: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    teal: 'bg-teal-500/10 text-teal-500 border-teal-500/20',
  };

  const relatedResources = mockResources
    .filter(r => r.category === resource.category && r.id !== resource.id)
    .slice(0, 3);

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
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${categoryColors[resource.categoryVariant] || categoryColors.purple} border`}>
                  <IconComponent className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl mb-3 text-foreground text-left">{resource.title}</h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg text-sm border ${categoryColors[resource.categoryVariant] || categoryColors.purple}`}>
                      {resource.category}
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {resource.downloads.toLocaleString()} downloads
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground text-lg leading-relaxed text-left">
                {resource.description}
              </p>
            </div>

            {/* Detailed Description */}
            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl mb-4 text-foreground text-left">About This Resource</h2>
              <StructuredDescription description={resource.detailedDescription} />
            </div>

            {/* What's Included */}
            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl mb-4 text-foreground text-left">What's Included</h2>
              <ul className="space-y-3 text-left">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-foreground">Comprehensive guide with step-by-step instructions</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-foreground">Real-world examples and case studies</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-foreground">Customizable templates and worksheets</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-foreground">Expert tips and best practices</span>
                </li>
              </ul>
            </div>

            {/* Related Resources */}
            {relatedResources.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-2xl mb-6 text-foreground text-left">Related Resources</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {relatedResources.map((related) => {
                    const RelatedIcon = iconMap[related.iconType] || FileText;
                    return (
                      <Link
                        key={related.id}
                        to={`/resources/${related.id}`}
                        className="p-4 border border-border rounded-xl hover:border-primary/50 transition-colors group"
                      >
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${categoryColors[related.categoryVariant] || categoryColors.purple} border`}>
                          <RelatedIcon className="w-6 h-6" />
                        </div>
                        <h3 className="text-foreground mb-2 text-sm group-hover:text-primary transition-colors text-left">
                          {related.title}
                        </h3>
                        <p className="text-xs text-muted-foreground text-left">
                          {related.downloads.toLocaleString()} downloads
                        </p>
                      </Link>
                    );
                  })}
                </div>
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
                  <p className="text-foreground font-medium">{resource.fileSize}</p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground mb-1">File Type</p>
                  <p className="text-foreground font-medium">{resource.fileType}</p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground mb-1">Downloads</p>
                  <p className="text-foreground font-medium">{resource.downloads.toLocaleString()}</p>
                </div>

                <div className="pt-4 border-t border-border space-y-3">
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
                  >
                    <Download className="w-5 h-5" />
                    Download Resource
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
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Uploaded By</p>
                    <p className="text-foreground">{resource.uploadedBy}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Upload Date</p>
                    <p className="text-foreground">{resource.uploadedDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="text-foreground">{resource.lastUpdated}</p>
                  </div>
                </div>
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
