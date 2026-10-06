import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomDropdown from '../../components/Admin/CustomDropdown';
import Toast from '../../components/Ui/Toast';
import { apiGet, apiPost, apiPatch } from '../../services/api';
import WhatsIncludedField from './components/WhatsIncludedField';
import FileUploadField from './components/FileUploadField';
import VideoLinkField from './components/VideoLinkField';
import LoadingState from './components/LoadingState';
import { resourceFormCopy as copy } from './resource.copy';
import {
  RESOURCE_CATEGORIES,
  RESOURCE_FILE_EXTENSIONS,
  RESOURCE_MAX_FILE_SIZE_MB,
  UPLOAD_TYPES,
  isVideoResource
} from './resourceOptions';

const SUCCESS_REDIRECT_DELAY = 1500;

const getInitialFormData = (resource) => ({
  title: resource?.title || '',
  category: resource?.category || '',
  description: resource?.description || '',
  detailed_description: resource?.detailed_description || '',
  whats_included: resource?.whats_included || '',
  // The API takes the creator name as uploaded_by and stores it in created_by
  uploaded_by: resource?.created_by || '',
  is_active: resource?.is_active !== undefined ? resource.is_active : true,
  file: null,
  video_link: isVideoResource(resource) ? (resource?.storage_url || '') : '',
  existing_file_name: resource?.file_name || '',
  existing_file_size: resource?.file_size || '',
});

const getInitialIncludedItems = (resource) => {
  const items = resource?.whats_included
    ? resource.whats_included.split('\n').filter(item => item.trim())
    : [];
  return items.length > 0 ? items : [''];
};

const getFileError = (file) => {
  const extension = file.name.split('.').pop().toLowerCase();
  if (!RESOURCE_FILE_EXTENSIONS.includes(extension)) {
    return copy.validation.fileType;
  }
  if (file.size > RESOURCE_MAX_FILE_SIZE_MB * 1024 * 1024) {
    return copy.validation.fileSize;
  }
  return null;
};

// Builds the request body. A selected file is sent as FormData, everything else as JSON.
const buildResourcePayload = (resourceData) => {
  const { file, ...fields } = resourceData;

  if (!file) {
    return fields;
  }

  const formData = new FormData();
  Object.keys(fields).forEach(key => {
    if (fields[key] !== null && fields[key] !== undefined && fields[key] !== '') {
      formData.append(key, fields[key]);
    }
  });

  // Append file last
  formData.append('file', file);

  return formData;
};

// Create and edit page. The route has an id when editing an existing resource.
export default function ResourceForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [resource, setResource] = React.useState(null);
  const [loading, setLoading] = React.useState(isEdit);
  const wasVideoLink = isVideoResource(resource);
  const [uploadType, setUploadType] = React.useState(UPLOAD_TYPES.file);
  const [formData, setFormData] = React.useState(() => getInitialFormData(null));
  const [whatsIncludedItems, setWhatsIncludedItems] = React.useState(() => getInitialIncludedItems(null));
  const [toast, setToast] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);
  const redirectTimer = React.useRef(null);

  // Create returns to the list, edit returns to the resource's detail page
  const returnPath = isEdit ? `/admin/resources/${id}` : '/admin/resources';

  // Load the resource and fill the form (edit mode)
  React.useEffect(() => {
    if (!isEdit) return;

    const fetchResource = async () => {
      try {
        setLoading(true);
        const data = await apiGet(`/resources/${id}`);
        setResource(data.resource);
        setUploadType(isVideoResource(data.resource) ? UPLOAD_TYPES.link : UPLOAD_TYPES.file);
        setFormData(getInitialFormData(data.resource));
        setWhatsIncludedItems(getInitialIncludedItems(data.resource));
      } catch (error) {
        console.error('Error fetching resource:', error);
        setToast({ message: copy.toasts.loadError, type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [id, isEdit]);

  // Cancel the pending redirect if the admin leaves the page first
  React.useEffect(() => {
    return () => clearTimeout(redirectTimer.current);
  }, []);

  const showError = (message) => {
    setToast({ message, type: 'error' });
  };

  const handleFileChange = (file) => {
    const fileError = file ? getFileError(file) : null;
    if (fileError) {
      showError(fileError);
      return;
    }
    setFormData({ ...formData, file });
  };

  const validate = () => {
    if (!formData.category) {
      return copy.validation.categoryRequired;
    }

    if (uploadType === UPLOAD_TYPES.link && !formData.video_link.trim()) {
      return copy.validation.videoLinkRequired;
    }

    // A file is needed on create, and on edit when switching from a video link to a file
    if (uploadType === UPLOAD_TYPES.file && !formData.file && (!isEdit || wasVideoLink)) {
      return copy.validation.fileRequired;
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    const validationError = validate();
    if (validationError) {
      showError(validationError);
      return;
    }

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

    if (uploadType === UPLOAD_TYPES.link) {
      resourceData.video_link = formData.video_link.trim();
    }

    // Only send a file for the file upload type (new upload or replacing the file)
    if (uploadType === UPLOAD_TYPES.file && formData.file) {
      resourceData.file = formData.file;
    }

    try {
      setSubmitting(true);
      const payload = buildResourcePayload(resourceData);
      if (isEdit) {
        await apiPatch(`/resources/${id}`, payload);
      } else {
        await apiPost('/resources', payload);
      }

      setToast({
        message: isEdit ? copy.toasts.updateSuccess : copy.toasts.createSuccess,
        type: 'success'
      });

      // Keep the button disabled until the redirect so the form cannot be submitted twice
      redirectTimer.current = setTimeout(() => navigate(returnPath), SUCCESS_REDIRECT_DELAY);
    } catch (error) {
      console.error('Error submitting resource:', error);

      const errorMessage = error.response?.data?.msg
        || error.response?.data?.message
        || error.message
        || (isEdit ? copy.toasts.updateError : copy.toasts.createError);

      showError(errorMessage);
      setSubmitting(false);
    }
  };

  const submitLabel = isEdit
    ? (submitting ? copy.buttons.updating : copy.buttons.update)
    : (submitting ? copy.buttons.creating : copy.buttons.create);

  if (loading) {
    return <LoadingState message={copy.loading} />;
  }

  if (isEdit && !resource) {
    return (
      <>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        <div className="text-center py-12">
          <h2 className="text-2xl text-foreground mb-2">{copy.notFound.title}</h2>
          <p className="text-muted-foreground">{copy.notFound.message}</p>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6 text-left">
      <button
        onClick={() => navigate(returnPath)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>{copy.back}</span>
      </button>
      
      <h1 className="text-3xl text-foreground mb-2">
        {isEdit ? copy.header.editTitle : copy.header.createTitle}
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        {copy.header.requiredNote.before} <span className="text-red-500">*</span> {copy.header.requiredNote.after}
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
              {copy.fields.title.label} <span className="text-red-500">*</span>
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
              label={copy.fields.category.label}
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
              {copy.fields.createdBy.label} <span className="text-red-500">*</span>
            </label>
            <input
              id="resource-created-by"
              type="text"
              value={formData.uploaded_by}
              onChange={(e) => setFormData({ ...formData, uploaded_by: e.target.value })}
              placeholder={copy.fields.createdBy.placeholder}
              className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">{copy.fields.createdBy.helper}</p>
          </div>

          <div>
            <label htmlFor="resource-description" className="block text-sm mb-2 text-foreground">
              {copy.fields.description.label} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="resource-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder={copy.fields.description.placeholder}
              className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              required
            />
          </div>

          <div>
            <label htmlFor="resource-detailed-description" className="block text-sm mb-2 text-foreground">
              {copy.fields.detailedDescription.label} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="resource-detailed-description"
              value={formData.detailed_description}
              onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
              rows={6}
              placeholder={copy.fields.detailedDescription.placeholder}
              className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              required
            />
          </div>

          <WhatsIncludedField
            items={whatsIncludedItems}
            onChange={setWhatsIncludedItems}
            copy={copy.fields.whatsIncluded}
          />

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
              />
              <div>
                <span className="text-sm font-medium text-foreground">{copy.fields.active.label}</span>
                <p className="text-xs text-muted-foreground">{copy.fields.active.helper}</p>
              </div>
            </label>
          </div>

          <div>
            <label className="block text-sm mb-2 text-foreground">
              {copy.fields.uploadType.label} <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="upload-type"
                  value={UPLOAD_TYPES.file}
                  checked={uploadType === UPLOAD_TYPES.file}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-foreground">{copy.fields.uploadType.file}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="upload-type"
                  value={UPLOAD_TYPES.link}
                  checked={uploadType === UPLOAD_TYPES.link}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-foreground">{copy.fields.uploadType.link}</span>
              </label>
            </div>

            {uploadType === UPLOAD_TYPES.file ? (
              <FileUploadField
                file={formData.file}
                onFileChange={handleFileChange}
                existingFileName={wasVideoLink ? '' : formData.existing_file_name}
                existingFileSize={formData.existing_file_size}
                isEdit={isEdit && !wasVideoLink}
                copy={copy.fields.file}
              />
            ) : (
              <VideoLinkField
                value={formData.video_link}
                onChange={(value) => setFormData({ ...formData, video_link: value })}
                currentLink={isEdit && wasVideoLink ? resource.storage_url : ''}
                copy={copy.fields.videoLink}
              />
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitLabel}
            </button>
            <button
              type="button"
              onClick={() => navigate(returnPath)}
              className="px-6 py-3 border border-border rounded-xl hover:bg-secondary"
            >
              {copy.buttons.cancel}
            </button>
          </div>
        </form>
      </div>
        </div>
      </div>
    </div>
  );
}
