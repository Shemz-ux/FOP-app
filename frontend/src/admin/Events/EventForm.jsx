import React from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import CustomDropdown from '../../components/Admin/CustomDropdown';
import DateInput from '../../components/Ui/DateInput';
import TimeInput from '../../components/Ui/TimeInput';
import Toast from '../../components/Ui/Toast';
import { EVENT_INDUSTRIES, EVENT_TYPES, EVENT_LOCATION_TYPES } from '../../utils/dropdownOptions';
import { parseDescriptionToSections, sectionsToDescription } from '../../utils/eventDescriptionParser';

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
    descriptionSections: event?.description_sections || [
      { header: 'About the Event', content: [''] },
      { header: 'What to Expect', content: [''] },
      { header: 'Who Should Attend', content: [''] },
    ],
  });

  const [imageFile, setImageFile] = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState(event?.event_image || null);
  const [toast, setToast] = React.useState(null);

  // Update form data when event prop changes (for edit mode)
  React.useEffect(() => {
    if (event) {
      console.log('Event data received:', event);
      console.log('Description sections:', event.description_sections);
      
      // Ensure we only have the 3 expected sections
      const defaultSections = [
        { header: 'About the Event', content: [''] },
        { header: 'What to Expect', content: [''] },
        { header: 'Who should Attend', content: [''] },
      ];
      
      let sections = defaultSections;
      if (event.description_sections && Array.isArray(event.description_sections)) {
        // Map existing sections to our expected format, only keeping the 3 we want
        const aboutSection = event.description_sections.find(s => 
          s.header && s.header.toLowerCase().includes('about the event')
        ) || defaultSections[0];
        
        const expectSection = event.description_sections.find(s => 
          s.header && s.header.toLowerCase().includes('what to expect')
        ) || defaultSections[1];
        
        const attendSection = event.description_sections.find(s => 
          s.header && (s.header.toLowerCase().includes('who should attend') || s.header.toLowerCase() === 'who should attend')
        ) || defaultSections[2];
        
        // Normalize the header to match our form's expected casing
        if (attendSection.header && attendSection.header.toLowerCase().includes('who should attend')) {
          attendSection.header = 'Who should Attend';
        }
        
        sections = [aboutSection, expectSection, attendSection];
      }
      
      setFormData({
        title: event.title || '',
        organiser: event.organiser || event.organiser || '',
        organiser_description: event.organiser_description || event.organiser_description || '',
        organiser_website: event.organiser_website || event.organiser_website || '',
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
    setFormData({
      ...formData,
      descriptionSections: [...formData.descriptionSections, { header: 'What to Expect', content: [''] }],
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const eventData = {
        title: formData.title,
        organiser: formData.organiser,
        organiser_description: formData.organiser_description,
        organiser_website: formData.organiser_website,
        industry: formData.industry,
        location: formData.location,
        address: formData.address,
        event_link: formData.event_link,
        event_date: formData.event_date,
        event_start_time: formData.event_start_time,
        event_end_time: formData.event_end_time,
        event_type: formData.event_type,
        location_type: formData.location_type,
        is_active: formData.is_active,
        description_sections: formData.descriptionSections
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
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="space-y-6 text-left">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <h1 className="text-2xl sm:text-3xl text-foreground mb-4 sm:mb-6">
            {isEdit ? 'Edit Event' : 'Create Event'}
          </h1>

          <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
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

                <div>
                  <label className="block text-sm mb-2 text-foreground">
                    Event Image
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Event preview"
                        className="w-16 h-16 object-cover rounded-lg border border-border"
                      />
                    )}
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-input rounded-xl hover:border-primary transition-colors cursor-pointer">
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {imageFile ? imageFile.name : 'Upload event image (Recommended for styling)'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
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
                                options={[
                                  { value: 'What to Expect', label: 'What to Expect' },
                                  { value: 'Who should Attend', label: 'Who should Attend' }
                                ]}
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
                  className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 order-1 sm:order-2"
                >
                  {isEdit ? 'Update Event' : 'Create Event'}
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
