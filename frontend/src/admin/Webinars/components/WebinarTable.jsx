import { useState } from "react";
import { Link } from "react-router-dom";
import { Video, Clock, Star, Edit, Trash2, Globe, FileEdit, Eye, BarChart } from "lucide-react";
import { formatDuration, formatViewCount, formatDate } from "../../../utils/webinarHelpers";
import ConfirmModal from "../../../components/Ui/ConfirmModal";

export default function WebinarTable({ 
  webinars, 
  onToggleStatus, 
  onToggleFeatured, 
  onEdit, 
  onDelete,
  copy 
}) {
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, webinar: null });

  const handleDeleteClick = (webinar) => {
    setConfirmModal({ isOpen: true, webinar });
  };

  const handleDeleteConfirm = () => {
    if (confirmModal.webinar) {
      onDelete(confirmModal.webinar.webinar_id);
      setConfirmModal({ isOpen: false, webinar: null });
    }
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block bg-card border border-border rounded-xl overflow-hidden">
        {webinars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <Video className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg text-foreground mb-2">No webinars found</h3>
            <p className="text-sm text-muted-foreground text-center">
              {copy.emptyState}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left px-6 py-4 text-sm text-foreground">
                    {copy.headers.webinar}
                  </th>
                  <th className="text-left px-6 py-4 text-sm text-foreground">
                    {copy.headers.category}
                  </th>
                  <th className="text-left px-6 py-4 text-sm text-foreground">
                    {copy.headers.duration}
                  </th>
                  <th className="text-left px-6 py-4 text-sm text-foreground">
                    {copy.headers.views}
                  </th>
                  <th className="text-left px-6 py-4 text-sm text-foreground">
                    {copy.headers.status}
                  </th>
                  <th className="text-left px-6 py-4 text-sm text-foreground">
                    {copy.headers.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {webinars.map((webinar) => (
                  <tr key={webinar.webinar_id} className="hover:bg-secondary/50 transition-colors">
                    {/* Webinar cell */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                          <img 
                            src={webinar.thumbnail_url} 
                            alt={webinar.title} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm text-foreground truncate max-w-[250px]">
                              {webinar.title}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Category */}
                    <td className="px-6 py-4 text-muted-foreground">
                      {webinar.category}
                    </td>
                    
                    {/* Duration */}
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-muted-foreground font-mono text-sm">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDuration(webinar.duration)}
                      </span>
                    </td>
                    
                    {/* Views */}
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatViewCount(webinar.view_count)}
                    </td>
                    
                    {/* Status */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onToggleStatus(webinar.webinar_id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          webinar.is_published
                            ? 'bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20'
                        }`}
                        title={copy.tooltips.toggleStatus}
                      >
                        {webinar.is_published ? (
                          <>
                            <Globe className="w-3.5 h-3.5" />
                            {copy.statusPublished}
                          </>
                        ) : (
                          <>
                            <FileEdit className="w-3.5 h-3.5" />
                            {copy.statusDraft}
                          </>
                        )}
                      </button>
                    </td>
                    
                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/webinars/${webinar.webinar_id}`}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                          title="View details"
                        >
                          <BarChart className="w-4 h-4 text-foreground" />
                        </Link>
                        <button
                          onClick={() => onToggleFeatured(webinar.webinar_id)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                          title={webinar.is_featured ? copy.tooltips.removeFeatured : copy.tooltips.featured}
                        >
                          <Star className={`w-4 h-4 ${
                            webinar.is_featured 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-foreground'
                          }`} />
                        </button>
                        <Link
                          to={`/admin/webinars/${webinar.webinar_id}/edit`}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                          title={copy.tooltips.edit}
                        >
                          <Edit className="w-4 h-4 text-foreground" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(webinar)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                          title={copy.tooltips.delete}
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
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {webinars.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <Video className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg text-foreground mb-2">No webinars found</h3>
              <p className="text-sm text-muted-foreground">
                {copy.emptyState}
              </p>
            </div>
          </div>
        ) : (
          webinars.map((webinar) => (
            <div key={webinar.webinar_id} className="bg-card border border-border rounded-xl p-4 space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-16 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                    <img 
                      src={webinar.thumbnail_url} 
                      alt={webinar.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <h3 className="text-base text-foreground truncate">
                        {webinar.title}
                      </h3>
                      {webinar.is_featured && (
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{webinar.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => onToggleStatus(webinar.webinar_id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                    webinar.is_published
                      ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                      : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  }`}
                >
                  {webinar.is_published ? (
                    <>
                      <Globe className="w-3 h-3" />
                      {copy.statusPublished}
                    </>
                  ) : (
                    <>
                      <FileEdit className="w-3 h-3" />
                      {copy.statusDraft}
                    </>
                  )}
                </button>
              </div>
              
              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatDuration(webinar.duration)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{formatViewCount(webinar.view_count)} views</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <Link
                  to={`/admin/webinars/${webinar.webinar_id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors"
                >
                  <BarChart className="w-4 h-4" />
                  View
                </Link>
                <button
                  onClick={() => onToggleFeatured(webinar.webinar_id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    webinar.is_featured
                      ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  <Star className={`w-4 h-4 ${webinar.is_featured ? 'fill-yellow-400' : ''}`} />
                  {webinar.is_featured ? 'Featured' : 'Feature'}
                </button>
                <Link
                  to={`/admin/webinars/${webinar.webinar_id}/edit`}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-secondary rounded-lg text-sm hover:bg-secondary/80 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteClick(webinar)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 text-red-500 rounded-lg text-sm hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, webinar: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Webinar"
        message={`Are you sure you want to delete "${confirmModal.webinar?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmButtonClass="bg-red-500 hover:bg-red-600 text-white"
      />
    </>
  );
}
