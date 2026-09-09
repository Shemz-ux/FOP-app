import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { webinarFormCopy } from './webinarForm.copy';
import AdminSelect from '../../Components/AdminSelect';
import Toast from '../../../components/Ui/Toast';

export function WebinarForm({ webinar, onSubmit, onCancel, isEdit = false }) {
  const [formData, setFormData] = useState({
    title: webinar?.title || '',
    description: webinar?.description || '',
    category: webinar?.category || '',
    youtube_url: webinar?.youtube_url || '',
    thumbnail_url: webinar?.thumbnail_url || '',
    is_published: webinar?.is_published !== undefined ? webinar.is_published : false,
    is_featured: webinar?.is_featured !== undefined ? webinar.is_featured : false,
  });

  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [videoMetadata, setVideoMetadata] = useState(null);
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);

  // Update form data when webinar prop changes (for edit mode)
  useEffect(() => {
    if (webinar) {
      setFormData({
        title: webinar.title || '',
        description: webinar.description || '',
        category: webinar.category || '',
        youtube_url: webinar.youtube_url || '',
        thumbnail_url: webinar.thumbnail_url || '',
        is_published: webinar.is_published !== undefined ? webinar.is_published : false,
        is_featured: webinar.is_featured !== undefined ? webinar.is_featured : false,
      });
      
      // Check if category is custom (not in predefined list)
      const isCustom = !webinarFormCopy.categories.some(cat => cat.value === webinar.category);
      if (isCustom && webinar.category) {
        setShowCustomCategory(true);
        setCustomCategory(webinar.category);
      }
      
      // Set existing metadata if available
      if (webinar.duration) {
        setVideoMetadata({
          duration: webinar.duration,
          thumbnail: webinar.thumbnail_url,
          title: webinar.title
        });
      }
    }
  }, [webinar]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Fetch metadata when YouTube URL changes
    if (name === 'youtube_url' && value) {
      const videoId = extractYouTubeId(value);
      if (videoId) {
        fetchYouTubeMetadata(videoId);
      }
    }
  };

  // Fetch YouTube video metadata
  const fetchYouTubeMetadata = async (videoId) => {
    setIsFetchingMetadata(true);
    try {
      // Using YouTube oEmbed API (no API key required)
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      
      if (!response.ok) {
        throw new Error('Invalid YouTube video');
      }
      
      const data = await response.json();
      
      // Get video duration using noembed.com (alternative that provides duration)
      const noembedResponse = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
      const noembedData = await noembedResponse.json();
      
      setVideoMetadata({
        title: data.title,
        thumbnail: data.thumbnail_url,
        duration: noembedData.duration || 0 // Duration in seconds if available
      });
      
      // Auto-fill thumbnail if not set
      if (!formData.thumbnail_url) {
        setFormData(prev => ({
          ...prev,
          thumbnail_url: data.thumbnail_url
        }));
      }
      
      setToast({
        message: 'Video verified successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Error fetching YouTube metadata:', error);
      setVideoMetadata(null);
      setToast({
        message: 'Could not verify YouTube video. Please check the URL.',
        type: 'error'
      });
    } finally {
      setIsFetchingMetadata(false);
    }
  };

  const handleCategoryChange = (value) => {
    if (value === '__custom__') {
      setShowCustomCategory(true);
      setFormData(prev => ({
        ...prev,
        category: customCategory
      }));
    } else {
      setShowCustomCategory(false);
      setCustomCategory('');
      setFormData(prev => ({
        ...prev,
        category: value
      }));
    }
  };

  const handleCustomCategoryChange = (e) => {
    const value = e.target.value;
    setCustomCategory(value);
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  // Helper function to extract YouTube video ID from URL
  const extractYouTubeId = (url) => {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setToast({ message: webinarFormCopy.validation.titleRequired, type: 'error' });
      return false;
    }
    if (!formData.description.trim()) {
      setToast({ message: webinarFormCopy.validation.descriptionRequired, type: 'error' });
      return false;
    }
    if (!formData.category.trim()) {
      setToast({ message: webinarFormCopy.validation.categoryRequired, type: 'error' });
      return false;
    }
    if (!formData.youtube_url.trim()) {
      setToast({ message: webinarFormCopy.validation.youtubeUrlRequired, type: 'error' });
      return false;
    }
    
    // Validate YouTube URL
    const videoId = extractYouTubeId(formData.youtube_url);
    if (!videoId) {
      setToast({ message: webinarFormCopy.validation.youtubeUrlInvalid, type: 'error' });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Extract video ID from URL
      const videoId = extractYouTubeId(formData.youtube_url);
      
      // Prepare data for submission
      const webinarData = {
        ...formData,
        youtube_video_id: videoId,
        youtube_url: formData.youtube_url,
        // Use metadata duration or default to 0 (will be fetched by backend)
        duration: videoMetadata?.duration || 0,
        // Use provided thumbnail or metadata thumbnail or generate default
        thumbnail_url: formData.thumbnail_url || 
          videoMetadata?.thumbnail ||
          `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
      };

      await onSubmit(webinarData);
      
      setToast({
        message: isEdit ? webinarFormCopy.success.updated : webinarFormCopy.success.created,
        type: 'success'
      });
    } catch (error) {
      console.error('Error submitting webinar:', error);
      setToast({
        message: error.message || webinarFormCopy.error.generic,
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copy = isEdit ? webinarFormCopy.edit : webinarFormCopy.create;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6 text-left">
          {/* Back Button */}
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{copy.backButton}</span>
          </button>

          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl mb-2 text-foreground">{copy.title}</h1>
            <p className="text-sm sm:text-base text-muted-foreground">{copy.subtitle}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm text-foreground mb-2">
                  {webinarFormCopy.fields.title.label}
                  {webinarFormCopy.fields.title.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder={webinarFormCopy.fields.title.placeholder}
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm text-foreground mb-2">
                  {webinarFormCopy.fields.description.label}
                  {webinarFormCopy.fields.description.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={webinarFormCopy.fields.description.placeholder}
                  rows={4}
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm text-foreground mb-2">
                  {webinarFormCopy.fields.category.label}
                  {webinarFormCopy.fields.category.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                {!showCustomCategory ? (
                  <AdminSelect
                    value={formData.category}
                    onValueChange={handleCategoryChange}
                    placeholder={webinarFormCopy.fields.category.placeholder}
                    options={[
                      ...webinarFormCopy.categories,
                      { value: '__custom__', label: `+ ${webinarFormCopy.fields.category.addNew}` }
                    ]}
                  />
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={customCategory}
                      onChange={handleCustomCategoryChange}
                      placeholder={webinarFormCopy.fields.category.customPlaceholder}
                      className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomCategory(false);
                        setCustomCategory('');
                        setFormData(prev => ({ ...prev, category: '' }));
                      }}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      ← Back to categories
                    </button>
                  </div>
                )}
              </div>

              {/* YouTube Video URL */}
              <div>
                <label htmlFor="youtube_url" className="block text-sm text-foreground mb-2">
                  {webinarFormCopy.fields.youtubeUrl.label}
                  {webinarFormCopy.fields.youtubeUrl.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                <input
                  type="url"
                  id="youtube_url"
                  name="youtube_url"
                  value={formData.youtube_url}
                  onChange={handleChange}
                  placeholder={webinarFormCopy.fields.youtubeUrl.placeholder}
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {webinarFormCopy.fields.youtubeUrl.help}
                </p>
              </div>

              {/* Video Metadata Preview */}
              {(isFetchingMetadata || videoMetadata) && (
                <div className="p-4 bg-secondary/30 rounded-xl">
                  {isFetchingMetadata ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      Verifying video...
                    </div>
                  ) : videoMetadata && (
                    <div className="space-y-2">
                      <p className="text-sm text-foreground font-medium">✓ Video verified</p>
                      {videoMetadata.title && (
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">YouTube Title:</span> {videoMetadata.title}
                        </p>
                      )}
                      {videoMetadata.duration > 0 && (
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">Duration:</span> {Math.floor(videoMetadata.duration / 60)}:{String(videoMetadata.duration % 60).padStart(2, '0')}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Thumbnail URL (Optional) */}
              <div>
                <label htmlFor="thumbnail_url" className="block text-sm text-foreground mb-2">
                  {webinarFormCopy.fields.thumbnailUrl.label}
                </label>
                <input
                  type="url"
                  id="thumbnail_url"
                  name="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={handleChange}
                  placeholder={webinarFormCopy.fields.thumbnailUrl.placeholder}
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {webinarFormCopy.fields.thumbnailUrl.help}
                </p>
              </div>

              {/* Published Checkbox */}
              <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-xl">
                <input
                  type="checkbox"
                  id="is_published"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                />
                <div>
                  <label htmlFor="is_published" className="text-sm text-foreground cursor-pointer">
                    {webinarFormCopy.fields.isPublished.label}
                  </label>
                  <p className="text-xs text-muted-foreground">
                    {webinarFormCopy.fields.isPublished.help}
                  </p>
                </div>
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-xl">
                <input
                  type="checkbox"
                  id="is_featured"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                />
                <div>
                  <label htmlFor="is_featured" className="text-sm text-foreground cursor-pointer">
                    {webinarFormCopy.fields.isFeatured.label}
                  </label>
                  <p className="text-xs text-muted-foreground">
                    {webinarFormCopy.fields.isFeatured.help}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting || isFetchingMetadata}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : copy.submitButton}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-border rounded-xl hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

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
