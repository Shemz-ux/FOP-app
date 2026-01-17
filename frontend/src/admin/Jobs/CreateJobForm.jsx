import React from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import AdminSelect from '../Components/AdminSelect';

export function CreateJobForm({ onCancel }) {
  const [formData, setFormData] = React.useState({
    title: '',
    company: '',
    companyColor: '#0084FF',
    shortDescription: '',
    industry: '',
    location: '',
    salary: '',
    job_level: '',
    role_type: '',
    work_mode: '',
    contact_email: '',
    job_link: '',
    deadline: '',
    is_active: true,
    descriptionSections: [
      { header: 'About the Role', content: [''] },
      { header: 'Responsibilities', content: [''] },
      { header: 'Requirements', content: [''] },
      { header: 'Benefits', content: [''] },
    ],
  });
  const [logoFile, setLogoFile] = React.useState(null);
  const [logoPreview, setLogoPreview] = React.useState(null);

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

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Create Job:', formData);
    console.log('Company Logo:', logoFile);
    onCancel();
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
      
      <h1 className="text-2xl sm:text-3xl text-foreground mb-4 sm:mb-6">Create Job Posting</h1>

      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 text-left">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="job-title" className="block text-sm mb-2 text-foreground">
                Job Title *
              </label>
              <input
                id="job-title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm mb-2 text-foreground">
                Company *
              </label>
              <input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm mb-2 text-foreground">
                Industry *
              </label>
              <input
                id="industry"
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="e.g. Technology, Finance, Healthcare"
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm mb-2 text-foreground">
                Location *
              </label>
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. London, Manchester"
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="job-level" className="block text-sm mb-2 text-foreground">
                Job Level *
              </label>
              <AdminSelect
                value={formData.job_level}
                onValueChange={(value) => setFormData({ ...formData, job_level: value })}
                placeholder="Select level"
                options={[
                  { value: 'Entry-level', label: 'Entry-level' },
                  { value: 'Mid-level', label: 'Mid-level' },
                  { value: 'Senior', label: 'Senior' },
                  { value: 'Lead', label: 'Lead' },
                  { value: 'Manager', label: 'Manager' }
                ]}
              />
            </div>

            <div>
              <label htmlFor="role-type" className="block text-sm mb-2 text-foreground">
                Role Type *
              </label>
              <AdminSelect
                value={formData.role_type}
                onValueChange={(value) => setFormData({ ...formData, role_type: value })}
                placeholder="Select type"
                options={[
                  { value: 'Full-time', label: 'Full-time' },
                  { value: 'Part-time', label: 'Part-time' },
                  { value: 'Internship', label: 'Internship' },
                  { value: 'Contract', label: 'Contract' }
                ]}
              />
            </div>

            <div>
              <label htmlFor="work-mode" className="block text-sm mb-2 text-foreground">
                Work Mode *
              </label>
              <AdminSelect
                value={formData.work_mode}
                onValueChange={(value) => setFormData({ ...formData, work_mode: value })}
                placeholder="Select mode"
                options={[
                  { value: 'Remote', label: 'Remote' },
                  { value: 'In-person', label: 'In-person' },
                  { value: 'Hybrid', label: 'Hybrid' }
                ]}
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
                placeholder="hr@company.com"
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="job-link" className="block text-sm mb-2 text-foreground">
                Job Link
              </label>
              <input
                id="job-link"
                type="url"
                value={formData.job_link}
                onChange={(e) => setFormData({ ...formData, job_link: e.target.value })}
                placeholder="https://company.com/jobs/123"
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="salary" className="block text-sm mb-2 text-foreground">
                Salary Range
              </label>
              <input
                id="salary"
                type="text"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                placeholder="e.g. £40,000 - £60,000"
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="deadline" className="block text-sm mb-2 text-foreground">
                Application Deadline
              </label>
              <input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-foreground">
                Company Logo
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-16 h-16 object-cover rounded-lg border border-border"
                  />
                )}
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-input rounded-xl hover:border-primary transition-colors cursor-pointer">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {logoFile ? logoFile.name : 'Upload company logo'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
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
                placeholder="Brief overview shown in job cards"
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="company-color" className="block text-sm mb-2 text-foreground">
                Company Brand Color
              </label>
              <input
                id="company-color"
                type="color"
                value={formData.companyColor}
                onChange={(e) => setFormData({ ...formData, companyColor: e.target.value })}
                className="w-20 h-10 rounded-lg border border-input cursor-pointer"
              />
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <label className="block text-sm text-foreground">
                  Job Description Sections *
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
                      placeholder="Section Header (e.g. About the Role, Responsibilities)"
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
                <span className="text-sm text-foreground">Set job posting as active</span>
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
              Create Job Posting
            </button>
          </div>
        </form>
      </div>
        </div>
      </div>
    </div>
  );
}
