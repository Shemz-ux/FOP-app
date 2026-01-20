import React from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import CustomDropdown from '../../components/Admin/CustomDropdown';
import Toast from '../../components/Ui/Toast';
import { apiPost, apiPatch } from '../../services/api';

const RESOURCE_CATEGORIES = [
  { value: 'CV', label: 'CV' },
  { value: 'Cover Letters', label: 'Cover Letters' },
  { value: 'Interviews', label: 'Interviews' },
  { value: 'Assessment Centres', label: 'Assessment Centres' },
  { value: 'LinkedIn', label: 'LinkedIn' },
  { value: 'Graduate Schemes', label: 'Graduate Schemes' },
  { value: 'Networking', label: 'Networking' },
  { value: 'Career Planning', label: 'Career Planning' },
  { value: 'Industry Insights', label: 'Industry Insights' },
  { value: 'Internship Guides', label: 'Internship Guides' },
  { value: 'Personal Branding', label: 'Personal Branding' },
  { value: 'Salary & Benefits', label: 'Salary & Benefits' },
  { value: 'Skills Development', label: 'Skills Development' },
  { value: 'First Job', label: 'First Job' },
  { value: 'Remote Work', label: 'Remote Work' },
];

export function ResourceForm({ resource, onSubmit, onCancel, isEdit = false }) {
  // Determine if resource is a video link or file upload
  const isVideoLink = resource?.file_type?.toLowerCase().includes('video') || 
                      resource?.storage_url?.includes('youtube.com') || 
                      resource?.storage_url?.includes('vimeo.com') ||
                      resource?.storage_url?.includes('youtu.be');
  const [uploadType, setUploadType] = React.useState(isVideoLink ? 'link' : 'file');
  const [formData, setFormData] = React.useState({
    title: resource?.title || '',
    category: resource?.category || '',
    description: resource?.description || '',
    detailed_description: resource?.detailed_description || '',
    whats_included: resource?.whats_included || '',
    uploaded_by: resource?.uploaded_by || '',
    is_active: resource?.is_active !== undefined ? resource.is_active : true,
    file: null,
    video_link: isVideoLink ? (resource?.storage_url || '') : '',
    existing_file_name: resource?.file_name || '',
    existing_file_size: resource?.file_size || '',
  });

  const [whatsIncludedItems, setWhatsIncludedItems] = React.useState(
    resource?.whats_included 
      ? resource.whats_included.split('\n').filter(item => item.trim())
      : ['']
  );
  const [toast, setToast] = React.useState(null);

  // Update form data when resource prop changes (for edit mode)
  React.useEffect(() => {
    if (resource) {
      // Check if it's a video link based on file type or URL
      const isVideoLink = resource.file_type?.toLowerCase().includes('video') ||
                         resource.storage_url?.includes('youtube.com') || 
                         resource.storage_url?.includes('vimeo.com') ||
                         resource.storage_url?.includes('youtu.be');
      setUploadType(isVideoLink ? 'link' : 'file');
      
      setFormData({
        title: resource.title || '',
        category: resource.category || '',
        description: resource.description || '',
        detailed_description: resource.detailed_description || '',
        whats_included: resource.whats_included || '',
        uploaded_by: resource.uploaded_by || '',
        is_active: resource.is_active !== undefined ? resource.is_active : true,
        file: null,
        video_link: isVideoLink ? (resource.storage_url || '') : '',
        existing_file_name: resource.file_name || '',
        existing_file_size: resource.file_size || '',
      });
      
      // Parse whats_included into array
      if (resource.whats_included) {
        const items = resource.whats_included.split('\n').filter(item => item.trim());
        setWhatsIncludedItems(items.length > 0 ? items : ['']);
      }
    }
  }, [resource]);

  const addIncludedItem = () => {
    setWhatsIncludedItems([...whatsIncludedItems, '']);
  };

  const removeIncludedItem = (index) => {
    const newItems = whatsIncludedItems.filter((_, i) => i !== index);
    setWhatsIncludedItems(newItems);
  };

  const updateIncludedItem = (index, value) => {
    const newItems = [...whatsIncludedItems];
    newItems[index] = value;
    setWhatsIncludedItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that either file or video link is provided for create mode only
    if (!isEdit) {
      if (uploadType === 'file' && !formData.file) {
        setToast({
          message: 'Please select a file to upload',
          type: 'error'
        });
        return;
      }
      
      if (uploadType === 'link' && !formData.video_link) {
        setToast({
          message: 'Please provide a video link',
          type: 'error'
        });
        return;
      }
    }
    
    // For edit mode with video link type, ensure video link is provided if changing to link
    if (isEdit && uploadType === 'link' && !formData.video_link && !formData.existing_file_name) {
      setToast({
        message: 'Please provide a video link',
        type: 'error'
      });
      return;
    }
    
    try {
      // Combine whats_included items into a single string with newlines
      const whatsIncludedString = whatsIncludedItems
        .filter(item => item.trim())
        .join('\n');

      const resourceData = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        detailed_description: formData.detailed_description,
        whats_included: whatsIncludedString,
        uploaded_by: formData.uploaded_by,
        is_active: formData.is_active,
        upload_type: uploadType,
      };
      
      // Add video link if upload type is link
      if (uploadType === 'link') {
        resourceData.video_link = formData.video_link;
      }
      
      // Add file if provided (for file upload type or replacing file)
      if (formData.file) {
        resourceData.file = formData.file;
      }

      await onSubmit(resourceData);
      
      setToast({
        message: `Resource has been ${isEdit ? 'updated' : 'created'} successfully!`,
        type: 'success'
      });
      
      setTimeout(() => onCancel(), 2000);
    } catch (error) {
      console.error('Error submitting resource:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        data: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.msg 
        || error.response?.data?.message 
        || error.message 
        || `Failed to ${isEdit ? 'update' : 'create'} resource. Please try again.`;
      
      setToast({
        message: errorMessage,
        type: 'error'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6 text-left">
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>
      
      <h1 className="text-3xl text-foreground mb-2">
        {isEdit ? 'Edit Resource' : 'Upload New Resource'}
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        All fields marked with <span className="text-red-500">*</span> are required.
      </p>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={5000}
          onClose={() => setToast(null)}
        />
      )}

      <div className="bg-card border border-border rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="resource-title" className="block text-sm mb-2 text-foreground">
              Resource Title <span className="text-red-500">*</span>
            </label>
            <input
              id="resource-title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <CustomDropdown
              label="Category"
              name="category"
              options={RESOURCE_CATEGORIES}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              className="text-left"
            />
          </div>

          <div>
            <label htmlFor="resource-created-by" className="block text-sm mb-2 text-foreground">
              Created By <span className="text-red-500">*</span>
            </label>
            <input
              id="resource-created-by"
              type="text"
              value={formData.uploaded_by}
              onChange={(e) => setFormData({ ...formData, uploaded_by: e.target.value })}
              placeholder="e.g. FOP Team, Career Services, Company Name"
              className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">Enter the company or person who created this resource</p>
          </div>

          <div>
            <label htmlFor="resource-description" className="block text-sm mb-2 text-foreground">
              Short Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="resource-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Brief overview shown in resource cards and at the top of detail page"
              className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              required
            />
          </div>

          <div>
            <label htmlFor="resource-detailed-description" className="block text-sm mb-2 text-foreground">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="resource-detailed-description"
              value={formData.detailed_description}
              onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
              rows={6}
              placeholder="Comprehensive description shown in 'About This Resource' section"
              className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-foreground">
              What's Included <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {whatsIncludedItems.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateIncludedItem(index, e.target.value)}
                    placeholder="e.g. • Comprehensive guide with step-by-step instructions"
                    className="flex-1 px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  {whatsIncludedItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIncludedItem(index)}
                      className="px-4 py-3 border border-border rounded-xl hover:bg-secondary text-muted-foreground"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addIncludedItem}
                className="px-4 py-2 border border-border rounded-xl hover:bg-secondary text-foreground text-sm"
              >
                + Add Item
              </button>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
              />
              <div>
                <span className="text-sm font-medium text-foreground">Set as Active</span>
                <p className="text-xs text-muted-foreground">Active resources are visible to users</p>
              </div>
            </label>
          </div>

          <div>
            <label className="block text-sm mb-2 text-foreground">
              Resource Type <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="upload-type"
                  value="file"
                  checked={uploadType === 'file'}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-foreground">File Upload</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="upload-type"
                  value="link"
                  checked={uploadType === 'link'}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-foreground">Video Link</span>
              </label>
            </div>

            {uploadType === 'file' ? (
              <div>
                {isEdit && formData.existing_file_name && (
                  <div className="mb-4 p-4 bg-secondary rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Current File</p>
                    <p className="text-foreground font-medium">{formData.existing_file_name}</p>
                    <p className="text-sm text-muted-foreground">{formData.existing_file_size}</p>
                  </div>
                )}
                <label className="block text-sm mb-2 text-foreground">
                  {isEdit ? 'Replace File (Optional)' : 'Upload File'} {!isEdit && <span className="text-red-500">*</span>}
                </label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground mb-2">
                    {formData.file ? formData.file.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm text-muted-foreground">PDF, DOC, DOCX files up to 10MB</p>
                  <input
                    type="file"
                    className="hidden"
                    id="file-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setFormData({ ...formData, file });
                    }}
                  />
                  <div className="flex gap-2 justify-center mt-4">
                    <label
                      htmlFor="file-upload"
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 cursor-pointer"
                    >
                      {formData.file ? 'Change File' : 'Select File'}
                    </label>
                    {formData.file && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, file: null });
                          document.getElementById('file-upload').value = '';
                        }}
                        className="px-6 py-3 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
                      >
                        Remove File
                      </button>
                    )}
                  </div>
                  {formData.file && (
                    <p className="mt-4 text-sm text-green-500 font-medium">✓ File selected: {formData.file.name}</p>
                  )}
                </div>
              </div>
            ) : (
              <div>
                {isEdit && formData.video_link && (
                  <div className="mb-4 p-4 bg-secondary rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Current Video Link</p>
                    <a href={formData.video_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                      {formData.video_link}
                    </a>
                  </div>
                )}
                <label htmlFor="video-link" className="block text-sm mb-2 text-foreground">
                  Video Link (YouTube, Vimeo, etc.) {!isEdit && <span className="text-red-500">*</span>}
                </label>
                <input
                  id="video-link"
                  type="url"
                  value={formData.video_link}
                  onChange={(e) => setFormData({ ...formData, video_link: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Supported: YouTube, Vimeo, or any direct video link
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90"
            >
              {isEdit ? 'Update Resource' : 'Upload Resource'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-border rounded-xl hover:bg-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
        </div>
      </div>
    </div>
  );
}
