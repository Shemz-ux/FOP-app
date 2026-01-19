import React from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import { Users } from 'lucide-react';
import CustomDropdown from '../../components/Admin/CustomDropdown';
import DateInput from '../../components/Ui/DateInput';
import TimeInput from '../../components/Ui/TimeInput';
import NumberInput from '../../components/Ui/NumberInput';
import { EVENT_INDUSTRIES, EVENT_TYPES, EVENT_LOCATION_TYPES } from '../../utils/dropdownOptions';
import { apiPost } from '../../services/api';

export function CreateEventForm({ onCancel }) {
  const [formData, setFormData] = React.useState({
    title: '',
    organiser: '',
    industry: '',
    shortDescription: '',
    location: '',
    address: '',
    event_link: '',
    contact_email: '',
    event_date: '',
    event_time: '',
    capacity: '',
    event_type: '',
    location_type: '',
    is_active: true,
    descriptionSections: [
      { header: 'About This Event', content: [''] },
      { header: 'What to Expect', content: [''] },
      { header: 'Who Should Attend', content: [''] },
    ],
  });
  const [imageFile, setImageFile] = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState(null);

  const addSection = () => {
    setFormData({
      ...formData,
      descriptionSections: [...formData.descriptionSections, { header: '', content: [''] }],
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
        industry: formData.industry,
        short_description: formData.shortDescription,
        location: formData.location,
        address: formData.address,
        event_link: formData.event_link,
        contact_email: formData.contact_email,
        event_date: formData.event_date,
        event_time: formData.event_time,
        capacity: formData.capacity,
        event_type: formData.event_type,
        location_type: formData.location_type,
        is_active: formData.is_active,
        description_sections: formData.descriptionSections
      };
      
      await apiPost('/events', eventData);
      
      alert('Event created successfully!');
      onCancel();
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
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
      
      <h1 className="text-2xl sm:text-3xl text-foreground mb-4 sm:mb-6">Create Event</h1>

      <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="event-title" className="block text-sm mb-2 text-foreground">
                Event Title *
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
                Organiser *
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
              <NumberInput
                label="Capacity"
                name="capacity"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                placeholder="Maximum attendees"
                min="1"
                icon={Users}
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
                showVariantPreview
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
                Location *
              </label>
              <input
                id="event-location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder={formData.event_type === 'virtual' ? 'Virtual Event' : 'e.g. San Francisco Convention Center'}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="event-address" className="block text-sm mb-2 text-foreground">
                Full Address
              </label>
              <input
                id="event-address"
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder={formData.event_type === 'virtual' ? 'Online via Zoom' : 'Full street address'}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
                label="Event Time"
                name="event_time"
                value={formData.event_time}
                onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-sm mb-2 text-foreground">
                Contact Email *
              </label>
              <input
                id="contact-email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                placeholder="contact@example.com"
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="event-link" className="block text-sm mb-2 text-foreground">
                Event Link
              </label>
              <input
                id="event-link"
                type="url"
                value={formData.event_link}
                onChange={(e) => setFormData({ ...formData, event_link: e.target.value })}
                placeholder="https://example.com/event"
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
                    {imageFile ? imageFile.name : 'Upload event image'}
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

            <div className="md:col-span-2">
              <label htmlFor="short-description" className="block text-sm mb-2 text-foreground">
                Short Description *
              </label>
              <textarea
                id="short-description"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                rows={3}
                placeholder="Brief overview shown in event cards"
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                required
              />
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <label className="block text-sm text-foreground">
                  Event Description Sections *
                </label>
                <button
                  type="button"
                  onClick={addSection}
                  className="px-4 py-2 border border-border rounded-xl hover:bg-secondary text-foreground text-sm"
                >
                  + Add Section
                </button>
              </div>
              
              {formData.descriptionSections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border border-border rounded-xl p-3 sm:p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={section.header}
                      onChange={(e) => updateSectionHeader(sectionIndex, e.target.value)}
                      placeholder="Section Header (e.g. About This Event, What to Expect)"
                      className="flex-1 px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                      required
                    />
                    {formData.descriptionSections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSection(sectionIndex)}
                        className="px-4 py-2 sm:py-3 border border-border rounded-xl hover:bg-secondary text-muted-foreground text-sm"
                      >
                        Remove Section
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-2 ml-4">
                    <label className="block text-xs text-muted-foreground">Content Items</label>
                    {section.content.map((item, contentIndex) => (
                      <div key={contentIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateContentItem(sectionIndex, contentIndex, e.target.value)}
                          placeholder="Bullet point content"
                          className="flex-1 px-4 py-2 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                          required
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
                </div>
              ))}
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
              Create Event
            </button>
          </div>
        </form>
      </div>
        </div>
      </div>
    </div>
  );
}
