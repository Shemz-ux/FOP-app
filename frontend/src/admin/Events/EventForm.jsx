import React from 'react';
import { ArrowLeft } from 'lucide-react';
import CustomDropdown from '../../components/Admin/CustomDropdown';
import DateInput from '../../components/Ui/DateInput';
import TimeInput from '../../components/Ui/TimeInput';
import Toast from '../../components/Ui/Toast';
import ImageUploadCard from '../../components/Admin/ImageUploadCard';
import { EVENT_INDUSTRIES, EVENT_TYPES, EVENT_LOCATION_TYPES } from '../../utils/dropdownOptions';
import { parseDescriptionToSections, sectionsToDescription } from '../../utils/eventDescriptionParser';
import { uploadMedia } from '../../services/Media/mediaUploadService';

export function EventForm({ event, onSubmit, onCancel, isEdit = false }) {
  const [formData, setFormData] = React.useState({
    title: event?.title || '',
    organiser: event?.organiser || '',
    organiser_description: event?.organiser_description || '',
    organiser_website: event?.organiser_website || '',
    industry: event?.industry || '',
    location: event?.location || '',
    address: event?.address || '',
    event_link: event?.event_link || '',
    event_date: event?.event_date ? event.event_date.split('T')[0] : '',
    event_start_time: event?.event_start_time || '',
    event_end_time: event?.event_end_time || '',
    event_type: event?.event_type || '',
    location_type: event?.location_type || '',
    is_active: event?.is_active !== undefined ? event.is_active : true,
    descriptionSections: event?.description_sections 
      ? event.description_sections.filter(section => 
          section.content && section.content.length > 0 && section.content.some(item => item.trim() !== '')
        )
      : [{ header: 'About the Event', content: [''] }],
  });

  const [imageFile, setImageFile] = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState(event?.event_image || null);
  const [logoFile, setLogoFile] = React.useState(null);
  const [logoPreview, setLogoPreview] = React.useState(event?.organiser_logo || null);
  const [toast, setToast] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);

  // Update form data when event prop changes (for edit mode)
  React.useEffect(() => {
    if (event) {
      console.log('Event data received:', event);
      console.log('Description sections:', event.description_sections);
      
      // Filter out sections that have no content or only empty strings
      let sections = [];
      if (event.description_sections && Array.isArray(event.description_sections)) {
        sections = event.description_sections.filter(section => 
          section.content && 
          section.content.length > 0 && 
          section.content.some(item => item && item.trim() !== '')
        );
      }
      
      // If no sections with content, add a default one
      if (sections.length === 0) {
        sections = [{ header: 'About the Event', content: [''] }];
      }
      
      setFormData({
        title: event.title || '',
        organiser: event.organiser || '',
        organiser_description: event.organiser_description || '',
        organiser_website: event.organiser_website || '',
        industry: event.industry || '',
        location: event.location || '',
        address: event.address || '',
        event_link: event.event_link || '',
        event_date: event.event_date ? event.event_date.split('T')[0] : '',
        event_start_time: event.event_start_time || '',
        event_end_time: event.event_end_time || '',
        event_type: event.event_type || '',
        location_type: event.location_type || '',
        is_active: event.is_active !== undefined ? event.is_active : true,
        descriptionSections: sections,
      });
      setImagePreview(event.event_image || null);
      setLogoPreview(event.organiser_logo || null);
    }
  }, [event]);

  // Auto-fill location and address when location_type is 'Online'
  React.useEffect(() => {
    if (formData.location_type === 'Online') {
      setFormData(prev => ({
        ...prev,
        location: 'Virtual Event',
        address: 'Online via Platform'
      }));
    }
  }, [formData.location_type]);

  const addSection = () => {
    // Get all currently used headers
    const usedHeaders = formData.descriptionSections.map(s => s.header);
    
    // Available header options
    const availableHeaders = ['What to Expect', 'Who should Attend'];
    
    // Find the first header that hasn't been used yet
    const newHeader = availableHeaders.find(header => !usedHeaders.includes(header)) || 'What to Expect';
    
    setFormData({
      ...formData,
      descriptionSections: [...formData.descriptionSections, { header: newHeader, content: [''] }],
    });
  };

  const removeSection = (sectionIndex) => {
    const newSections = formData.descriptionSections.filter((_, i) => i !== sectionIndex);
    setFormData({ ...formData, descriptionSections: newSections });
  };

  const updateSectionHeader = (sectionIndex, value) => {
    const newSections = [...formData.descriptionSections];
    newSections[sectionIndex].header = value;
    setFormData({ ...formData, descriptionSections: newSections });
  };

  const addContentItem = (sectionIndex) => {
    const newSections = [...formData.descriptionSections];
    newSections[sectionIndex].content.push('');
    setFormData({ ...formData, descriptionSections: newSections });
  };

  const removeContentItem = (sectionIndex, contentIndex) => {
    const newSections = [...formData.descriptionSections];
    newSections[sectionIndex].content = newSections[sectionIndex].content.filter((_, i) => i !== contentIndex);
    setFormData({ ...formData, descriptionSections: newSections });
  };

  const updateContentItem = (sectionIndex, contentIndex, value) => {
    const newSections = [...formData.descriptionSections];
    newSections[sectionIndex].content[contentIndex] = value;
    setFormData({ ...formData, descriptionSections: newSections });
  };

  const handleImageChange = (file) => {
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleLogoChange = (file) => {
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setUploading(true);

      let imageUrl = formData.event_image || imagePreview;
      if (imageFile) {
        console.log('Uploading event image to Cloudinary...');
        const uploadResult = await uploadMedia(
          imageFile,
          'event_image',
          isEdit ? event?.event_image : null
        );

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Failed to upload to Cloudinary');
        }

        imageUrl = uploadResult.data.url;
        console.log('Image uploaded successfully:', imageUrl);
      }

      let logoUrl = formData.organiser_logo || logoPreview;
      if (logoFile) {
        console.log('Uploading company logo to Cloudinary...');
        const logoUploadResult = await uploadMedia(
          logoFile,
          'company_logo',
          isEdit ? event?.organiser_logo : null
        );

        if (!logoUploadResult.success) {
          throw new Error(logoUploadResult.error || 'Failed to upload logo to Cloudinary');
        }

        logoUrl = logoUploadResult.data.url;
        console.log('Logo uploaded successfully:', logoUrl);
      }

      const eventData = {
        ...formData,
        event_image: imageUrl,
        organiser_logo: logoUrl,
        description_sections: formData.descriptionSections,
      };

      await onSubmit(eventData);

      setToast({
        message: `Event has been ${isEdit ? 'updated' : 'created'} successfully!`,
        type: 'success'
      });
      
      setTimeout(() => onCancel(), 2000);
    } catch (error) {
      console.error('Error submitting event:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        data: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.message
        || error.message
        || `Failed to ${isEdit ? 'update' : 'create'} event. Please try again.`;
      
      setToast({
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-6xl">
        <div className="space-y-4 sm:space-y-6 text-left">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors mb-2 sm:mb-4"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Back</span>
          </button>
          
          <h1 className="text-xl sm:text-2xl md:text-3xl text-foreground mb-3 sm:mb-4 md:mb-6">
            {isEdit ? 'Edit Event' : 'Create Event'}
          </h1>

          <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="event-title" className="block text-sm mb-2 text-foreground">
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="event-title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="organiser" className="block text-sm mb-2 text-foreground">
                    Organiser <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="organiser"
                    type="text"
                    value={formData.organiser}
                    onChange={(e) => setFormData({ ...formData, organiser: e.target.value })}
                    placeholder="e.g. TechConnect, Design Masters Inc"
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="organiser-website" className="block text-sm mb-2 text-foreground">
                    Organiser Website <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="organiser-website"
                    type="url"
                    value={formData.organiser_website}
                    onChange={(e) => setFormData({ ...formData, organiser_website: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="organiser-description" className="block text-sm mb-2 text-foreground">
                    Organiser Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="organiser-description"
                    value={formData.organiser_description}
                    onChange={(e) => setFormData({ ...formData, organiser_description: e.target.value })}
                    placeholder="Brief description about the organiser"
                    rows={3}
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <ImageUploadCard
                    imagePreview={logoPreview}
                    imageFile={logoFile}
                    onImageChange={handleLogoChange}
                    onRemoveImage={handleRemoveLogo}
                    label="Organiser Logo (optional)"
                    required={false}
                  />
                </div>

                <div>
                  <CustomDropdown
                    label="Industry"
                    name="industry"
                    options={EVENT_INDUSTRIES}
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    required
                    className="text-left"
                  />
                </div>

                <div>
                  <CustomDropdown
                    label="Event Type"
                    name="event_type"
                    options={EVENT_TYPES}
                    value={formData.event_type}
                    onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                    required
                    className="text-left"
                  />
                </div>

                <div>
                  <CustomDropdown
                    label="Location Type"
                    name="location_type"
                    options={EVENT_LOCATION_TYPES}
                    value={formData.location_type}
                    onChange={(e) => setFormData({ ...formData, location_type: e.target.value })}
                    required
                    className="text-left"
                  />
                </div>

                <div>
                  <label htmlFor="event-location" className="block text-sm mb-2 text-foreground">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="event-location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder={formData.location_type === 'online' ? 'Virtual Event' : 'e.g. London, Manchester'}
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="event-address" className="block text-sm mb-2 text-foreground">
                    Full Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="event-address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder={formData.location_type === 'online' ? 'Online via Platform' : 'Full street address'}
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <DateInput
                    label="Event Date"
                    name="event_date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <TimeInput
                    label="Event Start Time"
                    name="event_start_time"
                    value={formData.event_start_time}
                    onChange={(e) => setFormData({ ...formData, event_start_time: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <TimeInput
                    label="Event End Time"
                    name="event_end_time"
                    value={formData.event_end_time}
                    onChange={(e) => setFormData({ ...formData, event_end_time: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="event-link" className="block text-sm mb-2 text-foreground">
                    Event Link <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="event-link"
                    type="url"
                    value={formData.event_link}
                    onChange={(e) => setFormData({ ...formData, event_link: e.target.value })}
                    placeholder="https://example.com/event"
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <ImageUploadCard
                    imagePreview={imagePreview}
                    imageFile={imageFile}
                    onImageChange={handleImageChange}
                    onRemoveImage={handleRemoveImage}
                    label="Event Image (Optional)"
                    required={false}
                    aspectRatio={16/9}
                  />
                </div>

                
                <div className="md:col-span-2 space-y-6">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm text-foreground mb-2">
                      Event Description Sections <span className="text-red-500">*</span>
                    </label>
                    {formData.descriptionSections.length < 3 && (
                      <button
                        type="button"
                        onClick={addSection}
                        className="px-4 py-2 border border-border rounded-xl hover:bg-secondary text-foreground text-sm"
                      >
                        + Add Section
                      </button>
                    )}
                  </div>
                  
                  {formData.descriptionSections.map((section, sectionIndex) => {
                    const isAboutSection = section.header === 'About the Event';
                    
                    // Get all section headers except the current one
                    const usedHeaders = formData.descriptionSections
                      .map((s, i) => i !== sectionIndex ? s.header : null)
                      .filter(Boolean);
                    
                    // Filter out already-used headers from dropdown options
                    const availableOptions = [
                      { value: 'What to Expect', label: 'What to Expect' },
                      { value: 'Who should Attend', label: 'Who should Attend' }
                    ].filter(option => !usedHeaders.includes(option.value));
                    
                    return (
                      <div key={sectionIndex} className="border border-border rounded-xl p-4 space-y-3">
                        <div className="flex gap-2">
                          {sectionIndex === 0 ? (
                            <div className="flex-1 px-4 py-3 bg-input-background border border-input rounded-xl text-foreground font-bold">
                              About the Event
                            </div>
                          ) : (
                            <>
                              <CustomDropdown
                                value={section.header}
                                onChange={(e) => updateSectionHeader(sectionIndex, e.target.value)}
                                options={availableOptions}
                                placeholder="Select section type"
                                className="flex-1 font-bold"
                              />
                              <button
                                type="button"
                                onClick={() => removeSection(sectionIndex)}
                                className="px-4 py-3 border border-border rounded-xl hover:bg-secondary text-muted-foreground"
                              >
                                Remove Section
                              </button>
                            </>
                          )}
                        </div>
                        
                        {isAboutSection ? (
                          <div className="space-y-2 ml-4">
                            <label className="block text-xs text-muted-foreground">Content Items</label>
                            <textarea
                              value={section.content[0] || ''}
                              onChange={(e) => updateContentItem(sectionIndex, 0, e.target.value)}
                              placeholder="Full Event Description"
                              rows={3}
                              className="w-full px-4 py-2 bg-input-background border border-input rounded-lg text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
                              required
                            />
                          </div>
                        ) : (
                          <div className="space-y-2 ml-4">
                            <label className="block text-xs text-muted-foreground">Content Items</label>
                            {section.content.map((item, contentIndex) => (
                              <div key={contentIndex} className="flex gap-2">
                                <input
                                  type="text"
                                  value={item}
                                  onChange={(e) => updateContentItem(sectionIndex, contentIndex, e.target.value)}
                                  placeholder="Bullet point"
                                  className="flex-1 px-4 py-2 bg-input-background border border-input rounded-lg text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                />
                                {section.content.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeContentItem(sectionIndex, contentIndex)}
                                    className="px-3 py-2 border border-border rounded-lg hover:bg-secondary text-muted-foreground text-sm"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addContentItem(sectionIndex)}
                              className="px-3 py-1.5 border border-border rounded-lg hover:bg-secondary text-foreground text-xs"
                            >
                              + Add Item
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-sm text-foreground">Set event as active</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full sm:w-auto px-6 py-3 border border-border rounded-xl hover:bg-secondary text-foreground order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : isEdit ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={5000}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
