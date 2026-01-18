import React from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import CustomDropdown from '../../components/Admin/CustomDropdown';
import { RESOURCE_CATEGORIES, RESOURCE_FILE_TYPES } from '../../utils/dropdownOptions';

export function CreateResourceForm({ onCancel }) {
  const [formData, setFormData] = React.useState({
    title: '',
    category: '',
    categoryVariant: 'purple',
    description: '',
    detailedDescription: '',
    whatsIncluded: [''],
    createdBy: '',
    iconType: 'FileText',
    file: null,
  });

  const addIncludedItem = () => {
    setFormData({ ...formData, whatsIncluded: [...formData.whatsIncluded, ''] });
  };

  const removeIncludedItem = (index) => {
    const newItems = formData.whatsIncluded.filter((_, i) => i !== index);
    setFormData({ ...formData, whatsIncluded: newItems });
  };

  const updateIncludedItem = (index, value) => {
    const newItems = [...formData.whatsIncluded];
    newItems[index] = value;
    setFormData({ ...formData, whatsIncluded: newItems });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Create Resource:', formData);
    onCancel();
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
      
      <h1 className="text-3xl text-foreground mb-6">Upload New Resource</h1>

      <div className="bg-card border border-border rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="resource-title" className="block text-sm mb-2 text-foreground">
              Resource Title *
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
              showVariantPreview
              className="text-left"
            />
          </div>

          <div>
            <label htmlFor="resource-created-by" className="block text-sm mb-2 text-foreground">
              Created By *
            </label>
            <input
              id="resource-created-by"
              type="text"
              value={formData.createdBy}
              onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
              placeholder="e.g. Career Services Team, FOP Admin, Tech Society"
              className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Note: Icon type and category color will be automatically assigned based on your category selection.
            </p>
          </div>

          <div>
            <label htmlFor="resource-description" className="block text-sm mb-2 text-foreground">
              Short Description *
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
              Detailed Description *
            </label>
            <textarea
              id="resource-detailed-description"
              value={formData.detailedDescription}
              onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
              rows={6}
              placeholder="Comprehensive description shown in 'About This Resource' section"
              className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-foreground">
              What's Included *
            </label>
            <div className="space-y-3">
              {formData.whatsIncluded.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateIncludedItem(index, e.target.value)}
                    placeholder="e.g. Comprehensive guide with step-by-step instructions"
                    className="flex-1 px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  {formData.whatsIncluded.length > 1 && (
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
            <label className="block text-sm mb-2 text-foreground">
              Upload File *
            </label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground mb-2">Click to upload or drag and drop</p>
              <p className="text-sm text-muted-foreground">PDF, DOC, Video files up to 5MB</p>
              <input
                type="file"
                className="hidden"
                id="file-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setFormData({ ...formData, file });
                }}
              />
              <label
                htmlFor="file-upload"
                className="inline-block mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 cursor-pointer"
              >
                Select File
              </label>
              {formData.file && (
                <p className="mt-4 text-sm text-foreground">Selected: {formData.file.name}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90"
            >
              Upload Resource
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
