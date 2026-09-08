import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  Eye, 
  Trash2, 
  Pencil, 
  Clock,
  ThumbsUp,
  Video,
  Globe,
  FileEdit,
  Star,
  Calendar,
  Play
} from 'lucide-react';
import { testWebinars } from '../../pages/Webinars/webinars.copy';
import { adminWebinarDetailCopy } from './webinarDetail.copy';
import { formatDuration, formatViewCount, formatDate } from '../../utils/webinarHelpers';
import ConfirmModal from '../../components/Ui/ConfirmModal';
import Toast from '../../components/Ui/Toast';
import RelatedWebinars from './components/RelatedWebinars';

export default function WebinarDetail() {
  const { webinarId } = useParams();
  const navigate = useNavigate();
  const [webinar, setWebinar] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false });
  const [toast, setToast] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Find webinar from test data
    const foundWebinar = testWebinars.find(w => w.webinar_id === parseInt(webinarId));
    setWebinar(foundWebinar);
  }, [webinarId]);

  // Get related webinars (same category, excluding current, limit to 3)
  const relatedWebinars = webinar 
    ? testWebinars
        .filter(w => w.category === webinar.category && w.is_published)
        .slice(0, 5)
    : [];

  const handleDeleteClick = () => {
    setConfirmModal({ isOpen: true });
  };

  const handleDeleteConfirm = () => {
    setToast({
      message: `"${webinar.title}" has been deleted successfully`,
      type: 'success'
    });
    setTimeout(() => {
      navigate('/admin/webinars');
    }, 1500);
  };

  if (!webinar) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Video className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg text-foreground mb-2">Webinar not found</h3>
          <Link
            to="/admin/webinars"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            <ArrowLeft className="w-4 h-4" />
            {adminWebinarDetailCopy.navigation.back}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6 text-left">
          {/* Back Button */}
          <Link
            to="/admin/webinars"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {adminWebinarDetailCopy.navigation.back}
          </Link>

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl sm:text-3xl text-foreground break-words">
                  {webinar.title}
                </h1>
                {webinar.is_featured && (
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                )}
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm sm:text-base text-muted-foreground">{webinar.category}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {webinar.is_published && (
                <Link
                  to={`/webinars/${webinar.webinar_id}`}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-border text-foreground rounded-lg hover:bg-secondary transition-colors text-sm whitespace-nowrap"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">{adminWebinarDetailCopy.actions.viewPublic}</span>
                  <span className="sm:hidden">View</span>
                </Link>
              )}
              <Link
                to={`/admin/webinars/${webinar.webinar_id}/edit`}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-green-500/50 text-green-500 rounded-lg hover:bg-secondary text-sm whitespace-nowrap"
              >
                <Pencil className="w-4 h-4" />
                {adminWebinarDetailCopy.actions.edit}
              </Link>
              <button
                onClick={handleDeleteClick}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors text-sm whitespace-nowrap"
              >
                <Trash2 className="w-4 h-4" />
                {adminWebinarDetailCopy.actions.delete}
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                    {adminWebinarDetailCopy.stats.views}
                  </p>
                  <p className="text-2xl sm:text-3xl mb-1 text-foreground">
                    {formatViewCount(webinar.view_count)}
                  </p>
                </div>
                <div className="p-2 sm:p-3 rounded-xl bg-primary/10">
                  <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                    {adminWebinarDetailCopy.stats.likes}
                  </p>
                  <p className="text-2xl sm:text-3xl mb-1 text-foreground">
                    {formatViewCount(webinar.like_count)}
                  </p>
                </div>
                <div className="p-2 sm:p-3 rounded-xl bg-pink-500/10">
                  <ThumbsUp className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                    {adminWebinarDetailCopy.stats.duration}
                  </p>
                  <p className="text-2xl sm:text-3xl mb-1 text-foreground font-mono">
                    {formatDuration(webinar.duration)}
                  </p>
                </div>
                <div className="p-2 sm:p-3 rounded-xl bg-violet-500/10">
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-violet-500" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                    {adminWebinarDetailCopy.stats.category}
                  </p>
                  <p className="text-lg sm:text-xl mb-1 text-foreground">
                    {webinar.category}
                  </p>
                </div>
                <div className="p-2 sm:p-3 rounded-xl bg-green-500/10">
                  <Video className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                {isPlaying ? (
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${webinar.youtube_video_id}?autoplay=1`}
                      title={webinar.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div 
                    className="aspect-video bg-muted relative cursor-pointer group"
                    onClick={() => setIsPlaying(true)}
                  >
                    <img
                      src={webinar.thumbnail_url}
                      alt={webinar.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-2xl transform transition-transform duration-200 group-hover:scale-110">
                        <Play className="w-10 h-10 text-white fill-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white/70 text-sm">
                      Click to play
                    </div>
                  </div>
                )}
              </div>

              {/* Webinar Details */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg text-foreground mb-4">
                  {adminWebinarDetailCopy.sections.details}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">
                      {adminWebinarDetailCopy.fields.title}
                    </label>
                    <p className="text-foreground mt-1">{webinar.title}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      {adminWebinarDetailCopy.fields.description}
                    </label>
                    <p className="text-foreground mt-1 leading-relaxed">
                      {webinar.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Video Information */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg text-foreground mb-4">
                  {adminWebinarDetailCopy.sections.videoInfo}
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">
                      {adminWebinarDetailCopy.fields.youtubeId}
                    </span>
                    <span className="text-sm text-foreground font-mono">
                      {webinar.youtube_video_id}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">
                      {adminWebinarDetailCopy.fields.youtubeUrl}
                    </span>
                    <a
                      href={webinar.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      View on YouTube
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-muted-foreground">
                      {adminWebinarDetailCopy.fields.thumbnailUrl}
                    </span>
                    <a
                      href={webinar.thumbnail_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      View Image
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Status & Meta */}
            <div className="space-y-6">
              {/* Status & Visibility */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg text-foreground mb-4">
                  {adminWebinarDetailCopy.sections.status}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">
                      {adminWebinarDetailCopy.fields.status}
                    </label>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${
                        webinar.is_published
                          ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}
                    >
                      {webinar.is_published ? (
                        <>
                          <Globe className="w-4 h-4" />
                          {adminWebinarDetailCopy.fields.published}
                        </>
                      ) : (
                        <>
                          <FileEdit className="w-4 h-4" />
                          {adminWebinarDetailCopy.fields.draft}
                        </>
                      )}
                    </span>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">
                      {adminWebinarDetailCopy.fields.featured}
                    </label>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${
                        webinar.is_featured
                          ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                          : 'bg-secondary text-foreground border border-border'
                      }`}
                    >
                      <Star
                        className={`w-4 h-4 ${webinar.is_featured ? 'fill-yellow-400' : ''}`}
                      />
                      {webinar.is_featured
                        ? adminWebinarDetailCopy.fields.yes
                        : adminWebinarDetailCopy.fields.no}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{adminWebinarDetailCopy.fields.createdAt}</span>
                    </div>
                    <p className="text-foreground">{formatDate(webinar.created_at)}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{adminWebinarDetailCopy.fields.updatedAt}</span>
                    </div>
                    <p className="text-foreground">{formatDate(webinar.updated_at)}</p>
                  </div>
                </div>
              </div>

              {/* Related Webinars */}
              <RelatedWebinars
                webinars={relatedWebinars}
                currentWebinarId={webinar.webinar_id}
                copy={adminWebinarDetailCopy.sections.relatedTitle}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={handleDeleteConfirm}
        title={adminWebinarDetailCopy.deleteModal.title}
        message={adminWebinarDetailCopy.deleteModal.message}
        confirmText={adminWebinarDetailCopy.deleteModal.confirm}
        cancelText={adminWebinarDetailCopy.deleteModal.cancel}
        confirmVariant="danger"
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
