import React from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import AdminSelect from '../Components/AdminSelect';

export function EditResourceForm({ resource, onCancel }) {
  const [formData, setFormData] = React.useState({
    title: resource?.title || '',
    category: resource?.category || '',
    categoryVariant: resource?.categoryVariant || 'purple',
    description: resource?.description || '',
    detailedDescription: resource?.detailedDescription || '',
    whatsIncluded: resource?.whatsIncluded || [''],
    createdBy: resource?.uploadedBy || '',
    iconType: resource?.iconType || 'FileText',
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
    console.log('Update Resource:', { id: resource.id, ...formData });
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
      
      <h1 className="text-3xl text-foreground mb-6">Edit Resource</h1>
      <div className="bg-card border border-border rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="edit-resource-title" className="block text-sm mb-2 text-foreground">Resource Title *</label>
            <input id="edit-resource-title" type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" required />
          </div>
          <div>
            <label htmlFor="edit-resource-category" className="block text-sm mb-2 text-foreground">Category *</label>
            <AdminSelect
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              placeholder="Select category"
              options={[
                { value: 'Resume', label: 'Resume' },
                { value: 'Interview', label: 'Interview' },
                { value: 'Cover Letter', label: 'Cover Letter' },
                { value: 'Career Tips', label: 'Career Tips' },
                { value: 'LinkedIn', label: 'LinkedIn' },
                { value: 'Portfolio', label: 'Portfolio' },
                { value: 'Remote Work', label: 'Remote Work' },
                { value: 'Career Resources', label: 'Career Resources' },
                { value: 'Interview Preparation', label: 'Interview Preparation' },
                { value: 'Technical Skills', label: 'Technical Skills' },
              ]}
            />
          </div>
          <div>
            <label htmlFor="edit-resource-created-by" className="block text-sm mb-2 text-foreground">Created By *</label>
            <input id="edit-resource-created-by" type="text" value={formData.createdBy} onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })} placeholder="e.g. Career Services Team, FOP Admin, Tech Society" className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" required />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="edit-resource-icon-type" className="block text-sm mb-2 text-foreground">Icon Type *</label>
              <AdminSelect
                value={formData.iconType}
                onValueChange={(value) => setFormData({ ...formData, iconType: value })}
                placeholder="Select icon"
                options={[
                  { value: 'FileText', label: 'File Text' },
                  { value: 'BookOpen', label: 'Book Open' },
                  { value: 'File', label: 'File' }
                ]}
              />
            </div>
            <div>
              <label htmlFor="edit-resource-category-variant" className="block text-sm mb-2 text-foreground">Category Color *</label>
              <AdminSelect
                value={formData.categoryVariant}
                onValueChange={(value) => setFormData({ ...formData, categoryVariant: value })}
                placeholder="Select color"
                options={[
                  { value: 'purple', label: 'Purple' },
                  { value: 'green', label: 'Green' },
                  { value: 'orange', label: 'Orange' },
                  { value: 'pink', label: 'Pink' },
                  { value: 'blue', label: 'Blue' },
                  { value: 'teal', label: 'Teal' }
                ]}
              />
            </div>
          </div>
          <div>
            <label htmlFor="edit-resource-description" className="block text-sm mb-2 text-foreground">Short Description *</label>
            <textarea id="edit-resource-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} placeholder="Brief overview shown in resource cards and at the top of detail page" className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" required />
          </div>
          <div>
            <label htmlFor="edit-resource-detailed-description" className="block text-sm mb-2 text-foreground">Detailed Description *</label>
            <textarea id="edit-resource-detailed-description" value={formData.detailedDescription} onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })} rows={6} placeholder="Comprehensive description shown in 'About This Resource' section" className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" required />
          </div>
          <div>
            <label className="block text-sm mb-2 text-foreground">What's Included *</label>
            <div className="space-y-3">
              {formData.whatsIncluded.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input type="text" value={item} onChange={(e) => updateIncludedItem(index, e.target.value)} placeholder="e.g., Comprehensive guide with step-by-step instructions" className="flex-1 px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary" required />
                  {formData.whatsIncluded.length > 1 && (
                    <button type="button" onClick={() => removeIncludedItem(index)} className="px-4 py-3 border border-border rounded-xl hover:bg-secondary text-muted-foreground">Remove</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addIncludedItem} className="px-4 py-2 border border-border rounded-xl hover:bg-secondary text-foreground text-sm">+ Add Item</button>
            </div>
          </div>
          <div>
            <label className="block text-sm mb-2 text-foreground">Replace File (Optional)</label>
            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-input rounded-xl hover:border-primary transition-colors cursor-pointer">
              <Upload className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{formData.file ? formData.file.name : 'Upload new file'}</span>
              <input type="file" onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })} className="hidden" />
            </label>
            {formData.file && (
              <p className="mt-4 text-sm text-foreground">Selected: {formData.file.name}</p>
            )}
          </div>
          <div className="flex gap-4">
            <button type="submit" className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90">Update Resource</button>
            <button type="button" onClick={onCancel} className="px-6 py-3 border border-border rounded-xl hover:bg-secondary">Cancel</button>
          </div>
        </form>
      </div>
        </div>
      </div>
    </div>
  );
}
