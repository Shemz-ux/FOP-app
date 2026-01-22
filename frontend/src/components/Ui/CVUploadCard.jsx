import { useState } from "react";
import { FileText, Upload, X, Download, Eye } from "lucide-react";
import { cvService } from '../../services';

export default function CVUploadCard({ uploadedCV, onUpload, onDelete }) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only PDF, DOC, and DOCX files are allowed.');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit.');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // Upload to R2 (replace existing if present)
      const result = await cvService.uploadCV(file, uploadedCV?.cv_storage_key);

      // Call parent callback with CV metadata
      if (onUpload) {
        onUpload({
          cv_file_name: result.cv_file_name,
          cv_file_size: result.cv_file_size,
          cv_storage_key: result.cv_storage_key,
          cv_storage_url: result.cv_storage_url,
          cv_uploaded_at: result.cv_uploaded_at
        });
      }
    } catch (err) {
      console.error('CV upload error:', err);
      setError(err.message || 'Failed to upload CV');
    } finally {
      setIsUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleDeleteCV = async () => {
    if (!uploadedCV?.cv_storage_key) return;

    try {
      setIsDeleting(true);
      setError(null);

      // Delete from R2
      await cvService.deleteCV(uploadedCV.cv_storage_key);

      // Call parent callback
      if (onDelete) {
        onDelete();
      }
    } catch (err) {
      console.error('CV deletion error:', err);
      setError(err.message || 'Failed to delete CV');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewCV = async () => {
    if (!uploadedCV?.cv_storage_key) return;

    try {
      const downloadUrl = await cvService.getCVDownloadUrl(uploadedCV.cv_storage_key, uploadedCV.cv_file_name, 'inline');
      window.open(downloadUrl, '_blank');
    } catch (err) {
      console.error('CV view error:', err);
      setError(err.message || 'Failed to view CV');
    }
  };

  const handleDownloadCV = async () => {
    if (!uploadedCV?.cv_storage_key) return;

    try {
      await cvService.downloadCV(uploadedCV.cv_storage_key, uploadedCV.cv_file_name);
    } catch (err) {
      console.error('CV download error:', err);
      setError(err.message || 'Failed to download CV');
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-primary" />
        <h3 className="text-foreground">CV / Resume</h3>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
          {error}
        </div>
      )}

      {uploadedCV?.cv_file_name ? (
        <div className="p-4 bg-secondary/30 rounded-xl border border-border">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-foreground text-sm mb-1 truncate text-left">{uploadedCV?.cv_file_name}</div>
                <div className="text-muted-foreground text-xs text-left">
                  {uploadedCV?.cv_file_size} • Uploaded {uploadedCV?.cv_uploaded_at ? new Date(uploadedCV.cv_uploaded_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }) : 'N/A'}
                </div>
              </div>
            </div>
            <button
              onClick={handleDeleteCV}
              disabled={isDeleting}
              className="text-destructive hover:text-destructive/80 transition-colors shrink-0 disabled:opacity-50"
              aria-label="Delete CV"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-3 pt-3 border-t border-border flex flex-wrap gap-2">
            <button 
              onClick={handleViewCV}
              className="flex-1 min-w-[80px] px-2 py-2 text-xs sm:text-sm border border-border text-foreground rounded-lg hover:bg-secondary transition-colors flex items-center justify-center gap-1"
            >
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="whitespace-nowrap">View</span>
            </button>
            <button 
              onClick={handleDownloadCV}
              className="flex-1 min-w-[80px] px-2 py-2 text-xs sm:text-sm border border-border text-foreground rounded-lg hover:bg-secondary transition-colors flex items-center justify-center gap-1"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="whitespace-nowrap">Download</span>
            </button>
            <label className="flex-1 min-w-[80px] px-2 py-2 text-xs sm:text-sm border border-border text-foreground rounded-lg hover:bg-secondary transition-colors cursor-pointer flex items-center justify-center gap-1">
              <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="whitespace-nowrap">Replace</span>
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx"
                className="hidden"
                disabled={isUploading}
              />
            </label>
          </div>
        </div>
      ) : (
        <label className="block p-8 border-2 border-dashed border-border rounded-xl hover:border-primary/50 transition-colors cursor-pointer text-center">
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <div className="text-foreground mb-1">{isUploading ? 'Uploading...' : 'Upload your CV'}</div>
          <div className="text-sm text-muted-foreground mb-3">PDF, DOC, or DOCX (Max 5MB)</div>
          <div className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">
            {isUploading ? 'Uploading...' : 'Choose File'}
          </div>
          <input
            type="file"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx"
            className="hidden"
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  );
}
