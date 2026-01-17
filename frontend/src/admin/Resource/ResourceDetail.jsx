import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Trash2, Edit, BarChart, FileText, BookOpen, File, User, Calendar } from 'lucide-react';
import { mockResources } from '../../services/Admin/admin-analytics';

export default function ResourceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const resource = mockResources.find(r => r.id === parseInt(id));

  if (!resource) {
    return (
      <div className="space-y-6 text-left">
        <button
          onClick={() => navigate('/admin/resources')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Resources</span>
        </button>
        <div className="text-center py-12">
          <h2 className="text-2xl text-foreground mb-2">Resource Not Found</h2>
          <p className="text-muted-foreground">The resource you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const iconMap = {
    FileText: FileText,
    BookOpen: BookOpen,
    File: File,
  };

  const IconComponent = iconMap[resource.iconType] || FileText;
  const categoryColors = {
    purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    green: 'bg-green-500/10 text-green-500 border-green-500/20',
    orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    pink: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    teal: 'bg-teal-500/10 text-teal-500 border-teal-500/20',
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6 text-left">
      <button
        onClick={() => navigate('/admin/resources')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Resources</span>
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="flex items-start gap-6 mb-6">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${categoryColors[resource.categoryVariant] || categoryColors.purple} border`}>
                <IconComponent className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl mb-3 text-foreground">{resource.title}</h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-3 py-1 rounded-lg text-sm border ${categoryColors[resource.categoryVariant] || categoryColors.purple}`}>
                    {resource.category}
                  </span>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {resource.downloads?.toLocaleString() || resource.downloads} downloads
                  </span>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed">
              {resource.description}
            </p>
          </div>

          {/* Detailed Description */}
          {resource.detailedDescription && (
            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl mb-4 text-foreground">About This Resource</h2>
              <p className="text-foreground leading-relaxed whitespace-pre-line">
                {resource.detailedDescription}
              </p>
            </div>
          )}

          {/* What's Included */}
          {resource.whatsIncluded && resource.whatsIncluded.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl mb-4 text-foreground">What's Included</h2>
              <ul className="space-y-3">
                {resource.whatsIncluded.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Admin Actions */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-xl mb-4 text-foreground">Admin Actions</h2>
            <div className="flex gap-3">
              <Link
                to={`/admin/resources/${resource.id}/edit`}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Resource
              </Link>
              <button className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-secondary flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </button>
              <button className="px-4 py-2 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/10 flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Resource Stats */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg mb-4 text-foreground">Resource Stats</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">File Size</p>
                <p className="text-foreground font-medium">{resource.fileSize}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">File Type</p>
                <p className="text-foreground font-medium">{resource.fileType || resource.fileFormat}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Downloads</p>
                <p className="text-foreground font-medium">{resource.downloads?.toLocaleString() || resource.downloads}</p>
              </div>
            </div>
          </div>

          {/* Resource Information */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg mb-4 text-foreground">Resource Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Uploaded By</p>
                  <p className="text-foreground">{resource.uploadedBy || resource.createdBy || 'Admin'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Upload Date</p>
                  <p className="text-foreground">{resource.uploadedDate || resource.posted}</p>
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

          {/* Analytics Card */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <BarChart className="w-5 h-5 text-primary" />
              <h3 className="text-lg text-foreground">Analytics</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              View detailed analytics and download trends for this resource.
            </p>
            <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
              View Analytics
            </button>
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}
