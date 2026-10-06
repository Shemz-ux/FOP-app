import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Trash2, ExternalLink, Pencil, Eye } from 'lucide-react';
import ConfirmModal from '../../components/Ui/ConfirmModal';
import Toast from '../../components/Ui/Toast';
import { apiGet, apiDelete } from '../../services/api';
import { formatFileType } from '../../utils/fileTypeFormatter';
import StatusBadge from './components/StatusBadge';
import LoadingState from './components/LoadingState';
import { isVideoResource } from './resourceOptions';
import { resourceDetailCopy as copy } from './resource.copy';

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
        message: copy.toasts.deleteSuccess(resource.title),
        type: 'success'
      });
      setTimeout(() => {
        navigate('/admin/resources');
      }, 1500);
    } catch (error) {
      console.error('Error deleting resource:', error);
      const errorMessage = error.response?.data?.msg || error.response?.data?.message || error.message || copy.toasts.deleteError;
      setToast({
        message: errorMessage,
        type: 'error'
      });
    }
    setConfirmModal({ isOpen: false });
  };

  const handleViewResource = async () => {
    try {
      // Get presigned URL with inline disposition for viewing
      const response = await apiGet(`/resources/${id}/download?disposition=inline`);
      window.open(response.download_url, '_blank');
    } catch (error) {
      console.error('Error viewing resource:', error);
      setToast({
        message: copy.toasts.viewError,
        type: 'error'
      });
    }
  };

  const handleDownloadResource = async () => {
    try {
      // Get presigned URL with attachment disposition for downloading
      const response = await apiGet(`/resources/${id}/download`);
      window.open(response.download_url, '_blank');
    } catch (error) {
      console.error('Error downloading resource:', error);
      setToast({
        message: copy.toasts.downloadError,
        type: 'error'
      });
    }
  };

  if (loading) {
    return <LoadingState message={copy.loading} />;
  }

  if (!resource) {
    return (
      <div className="space-y-6 text-left">
        <button
          onClick={() => navigate('/admin/resources')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{copy.back}</span>
        </button>
        <div className="text-center py-12">
          <h2 className="text-2xl text-foreground mb-2">{copy.notFound.title}</h2>
          <p className="text-muted-foreground">{copy.notFound.message}</p>
        </div>
      </div>
    );
  }

  const isVideo = isVideoResource(resource);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6 text-left">
      <button
        onClick={() => navigate('/admin/resources')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>{copy.back}</span>
      </button>
      
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl mb-2 text-foreground break-words">{resource.title}</h1>
          <div className="flex items-center gap-3">
            <p className="text-sm sm:text-base text-muted-foreground">{resource.category}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={`/resources/${resource.resource_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-border text-foreground rounded-lg hover:bg-secondary transition-colors text-sm whitespace-nowrap"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">{copy.actions.viewOnWebsite}</span>
            <span className="sm:hidden">{copy.actions.viewOnWebsiteShort}</span>
          </a>
          <Link
            to={`/admin/resources/${resource.resource_id}/edit`}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-green-500/50 text-green-500 rounded-lg hover:bg-secondary text-sm whitespace-nowrap"
          >
            <Pencil className="w-4 h-4" />
            {copy.actions.edit}
          </Link>
          <button
            onClick={handleDeleteClick}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors text-sm whitespace-nowrap"
          >
            <Trash2 className="w-4 h-4" />
            {copy.actions.delete}
          </button>
        </div>
      </div>

      {/* Resource Info Header */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{copy.info.resourceType}</p>
            <p className="text-foreground font-medium">
              {isVideo ? copy.info.typeVideo : copy.info.typeFile}
            </p>
          </div>
          {resource.file_size && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">{copy.info.fileSize}</p>
              <p className="text-foreground font-medium">{resource.file_size}</p>
            </div>
          )}
          {resource.file_type && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">{copy.info.fileType}</p>
              <p className="text-foreground font-medium">{formatFileType(resource.file_type)}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground mb-1">{copy.info.downloads}</p>
            <p className="text-foreground font-medium">{resource.download_count?.toLocaleString() || 0}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">{copy.info.createdBy}</p>
            <p className="text-foreground font-medium">{resource.created_by || copy.info.createdByFallback}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">{copy.info.uploadDate}</p>
            <p className="text-foreground font-medium">{new Date(resource.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">{copy.info.lastUpdated}</p>
            <p className="text-foreground font-medium">{new Date(resource.updated_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">{copy.info.status}</p>
            <StatusBadge isActive={resource.is_active} labels={copy.status} />
          </div>
        </div>
      </div>

      {/* Resource Access */}
      {resource.storage_url && (
        <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl text-foreground mb-4">{copy.access.title}</h2>
          {isVideo ? (
            <div className="space-y-4">
              <p className="text-sm sm:text-base text-muted-foreground">{copy.access.videoMessage}</p>
              <a
                href={resource.storage_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm sm:text-base"
              >
                <Eye className="w-4 h-4" />
                {copy.access.watchVideo}
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm sm:text-base text-muted-foreground">{copy.access.fileMessage}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleViewResource}
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 border border-border text-foreground rounded-lg hover:bg-secondary transition-colors text-sm sm:text-base"
                >
                  <Eye className="w-4 h-4" />
                  {copy.access.viewResource}
                </button>
                <button
                  onClick={handleDownloadResource}
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm sm:text-base"
                >
                  <Download className="w-4 h-4" />
                  {copy.access.downloadResource}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Description */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl text-foreground mb-4">{copy.sections.description}</h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {resource.description}
        </p>
      </div>

      {/* Detailed Description */}
      {resource.detailed_description && (
        <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl text-foreground mb-4">{copy.sections.detailedDescription}</h2>
          <p className="text-sm sm:text-base text-foreground leading-relaxed whitespace-pre-line">
            {resource.detailed_description}
          </p>
        </div>
      )}

      {/* What's Included */}
      {resource.whats_included && (
        <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl text-foreground mb-4">{copy.sections.whatsIncluded}</h2>
          <ul className="space-y-2 sm:space-y-3">
            {resource.whats_included.split('\n').filter(item => item.trim()).map((item, index) => (
              <li key={index} className="flex items-start gap-2 sm:gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm sm:text-base text-foreground">{item.trim()}</span>
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
        title={copy.deleteModal.title}
        message={resource ? copy.deleteModal.message(resource.title) : ''}
        confirmText={copy.deleteModal.confirm}
        cancelText={copy.deleteModal.cancel}
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
