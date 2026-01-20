import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Trash2, ExternalLink, Pencil, FileText, User, Calendar, Eye, CheckCircle, XCircle } from 'lucide-react';
import ConfirmModal from '../../components/Ui/ConfirmModal';
import Toast from '../../components/Ui/Toast';
import { apiGet, apiDelete } from '../../services/api';

export default function ResourceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true);
        const data = await apiGet(`/resources/${id}`);
        setResource(data.resource);
      } catch (error) {
        console.error('Error fetching resource:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResource();
  }, [id]);

  const handleDeleteClick = () => {
    setConfirmModal({ isOpen: true });
  };

  const handleDeleteConfirm = async () => {
    try {
      await apiDelete(`/resources/${resource.resource_id}`);
      setToast({
        message: `"${resource.title}" has been deleted successfully`,
        type: 'success'
      });
      setTimeout(() => {
        navigate('/admin/resources');
      }, 1500);
    } catch (error) {
      console.error('Error deleting resource:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete resource. Please try again.';
      setToast({
        message: errorMessage,
        type: 'error'
      });
    }
    setConfirmModal({ isOpen: false });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading resource...</p>
        </div>
      </div>
    );
  }

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

  const getCategoryColor = (category) => {
    const colors = {
      'CV': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      'Cover Letters': 'bg-green-500/10 text-green-500 border-green-500/20',
      'Interviews': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      'Assessment Centres': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      'LinkedIn': 'bg-teal-500/10 text-teal-500 border-teal-500/20',
      'Graduate Schemes': 'bg-pink-500/10 text-pink-500 border-pink-500/20',
      'Networking': 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      'Career Planning': 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
      'Industry Insights': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      'Internship Guides': 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      'Personal Branding': 'bg-violet-500/10 text-violet-500 border-violet-500/20',
      'Salary & Benefits': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      'Skills Development': 'bg-lime-500/10 text-lime-500 border-lime-500/20',
      'First Job': 'bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/20',
      'Remote Work': 'bg-sky-500/10 text-sky-500 border-sky-500/20',
    };
    return colors[category] || 'bg-purple-500/10 text-purple-500 border-purple-500/20';
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
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2 text-foreground">{resource.title}</h1>
          <div className="flex items-center gap-3">
            <p className="text-muted-foreground">{resource.category}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a
            href={`/resources/${resource.resource_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-secondary transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View on Website
          </a>
          <Link
            to={`/admin/resources/${resource.resource_id}/edit`}
            className="flex items-center gap-2 px-4 py-2 border border-green-500/50 text-green-500 rounded-lg hover:bg-secondary"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={handleDeleteClick}
            className="flex items-center gap-2 px-4 py-2 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Resource Info Header */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Resource Type</p>
            <p className="text-foreground font-medium">
              {resource.file_type === 'video/link' ? 'Video Link' : 'File'}
            </p>
          </div>
          {resource.file_size && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">File Size</p>
              <p className="text-foreground font-medium">{resource.file_size}</p>
            </div>
          )}
          {resource.file_type && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">File Type</p>
              <p className="text-foreground font-medium">{resource.file_type}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Downloads/Views</p>
            <p className="text-foreground font-medium">{resource.download_count?.toLocaleString() || 0}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Created By</p>
            <p className="text-foreground font-medium">{resource.created_by || 'FOP'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Upload Date</p>
            <p className="text-foreground font-medium">{new Date(resource.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
            <p className="text-foreground font-medium">{new Date(resource.updated_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Status</p>
             <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ${
              resource.is_active
                ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                : 'bg-red-500/10 text-red-500 border border-red-500/20'
            }`}>
              {resource.is_active ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  Active
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5" />
                  Inactive
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Resource Access */}
      {resource.storage_url && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl text-foreground mb-4">Access Resource</h2>
          {resource.file_type?.toLowerCase().includes('video') || resource.file_type === 'video/link' || resource.storage_url.includes('youtube.com') || resource.storage_url.includes('vimeo.com') || resource.storage_url.includes('youtu.be') ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">This resource is a video hosted externally.</p>
              <a
                href={resource.storage_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
              >
                <Eye className="w-4 h-4" />
                Watch Video
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">Download or view this resource file.</p>
              <a
                href={resource.storage_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
              >
                <Download className="w-4 h-4" />
                Download Resource
              </a>
            </div>
          )}
        </div>
      )}

      {/* Description */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl text-foreground mb-4">Short Description</h2>
        <p className="text-muted-foreground leading-relaxed">
          {resource.description}
        </p>
      </div>

      {/* Detailed Description */}
      {resource.detailed_description && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl text-foreground mb-4">About This Resource</h2>
          <p className="text-foreground leading-relaxed whitespace-pre-line">
            {resource.detailed_description}
          </p>
        </div>
      )}

      {/* What's Included */}
      {resource.whats_included && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl text-foreground mb-4">What's Included</h2>
          <ul className="space-y-3">
            {resource.whats_included.split('\n').filter(item => item.trim()).map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-foreground">{item.trim()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

        </div>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={handleDeleteConfirm}
        title="Delete Resource"
        message={resource ? `Are you sure you want to delete "${resource.title}"? This action cannot be undone.` : ''}
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
