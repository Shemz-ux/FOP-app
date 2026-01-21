import React from 'react';
import { ArrowLeft } from 'lucide-react';
import CustomDropdown from '../../components/Admin/CustomDropdown';
import DateInput from '../../components/Ui/DateInput';
import Toast from '../../components/Ui/Toast';
import { JOB_INDUSTRIES, JOB_ROLE_TYPES, JOB_WORK_TYPES, JOB_EXPERIENCE_LEVELS } from '../../utils/dropdownOptions';
import { parseDescriptionToSections, sectionsToDescription } from '../../utils/jobDescriptionParser';

export function JobForm({ job, onSubmit, onCancel, isEdit = false }) {

  const [formData, setFormData] = React.useState({
    title: job?.title || '',
    company: job?.company || '',
    companyColor: job?.company_color || '#0084FF',
    companyLogo: job?.company_logo || '',
    companyWebsite: job?.company_website || '',
    companyDescription: job?.company_description || '',
    shortDescription: job?.short_description || '',
    industry: job?.industry || '',
    location: job?.location || '',
    experience_level: job?.experience_level || '',
    role_type: job?.role_type || '',
    work_type: job?.work_type || job?.work_mode || '',
    job_link: job?.job_link || '',
    deadline: job?.deadline || '',
    is_active: job?.is_active !== undefined ? job.is_active : true,
    descriptionSections: job?.description_sections || parseDescriptionToSections(job?.description) || [
      { header: 'About the Role', content: [''] },
      { header: 'Responsibilities', content: [''] },
      { header: 'Requirements', content: [''] },
      { header: 'Benefits', content: [''] },
    ],
  });

  const [isRollingDeadline, setIsRollingDeadline] = React.useState(!job?.deadline);
  const [toast, setToast] = React.useState(null);

  const addSection = () => {
    setFormData({
      ...formData,
      descriptionSections: [...formData.descriptionSections, { header: 'Responsibilities', content: [''] }],
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Convert descriptionSections to description string with proper formatting
      const descriptionText = sectionsToDescription(formData.descriptionSections);

      const jobData = {
        title: formData.title,
        company: formData.company,
        company_color: formData.companyColor,
        company_logo: formData.companyLogo || null,
        company_website: formData.companyWebsite,
        company_description: formData.companyDescription,
        short_description: formData.shortDescription,
        description: descriptionText,
        industry: formData.industry,
        location: formData.location,
        experience_level: formData.experience_level,
        role_type: formData.role_type,
        work_type: formData.work_type,
        job_link: formData.job_link,
        deadline: isRollingDeadline ? null : formData.deadline,
        is_active: formData.is_active,
        description_sections: formData.descriptionSections
      };
      
      await onSubmit(jobData);
      setToast({
        message: `Job posting has been ${isEdit ? 'updated' : 'created'} successfully!`,
        type: 'success'
      });
    } catch (error) {
      console.error('Error submitting job:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        data: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.message 
        || error.message 
        || `Failed to ${isEdit ? 'update' : 'create'} job. Please try again.`;
      
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
        {isEdit ? 'Edit Job Posting' : 'Create Job Posting'}
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        All fields marked with <span className="text-red-500">*</span> must be filled, otherwise the job will not be posted.
      </p>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={5000}
          onClose={() => setToast(null)}
        />
      )}

      <div className="bg-card border border-border rounded-xl p-6 text-left">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="job-title" className="block text-sm mb-2 text-foreground">
                Job Title <span className="text-red-500">*</span>
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
                Company <span className="text-red-500">*</span>
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
              <CustomDropdown
                label="Industry"
                name="industry"
                options={JOB_INDUSTRIES}
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                required
                className="text-left"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm mb-2 text-foreground">
                Location <span className="text-red-500">*</span>
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
              <CustomDropdown
                label="Experience Level"
                name="experience_level"
                options={JOB_EXPERIENCE_LEVELS}
                value={formData.experience_level}
                onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                required
                className="text-left"
              />
            </div>

            <div>
              <CustomDropdown
                label="Role Type"
                name="role_type"
                options={JOB_ROLE_TYPES}
                value={formData.role_type}
                onChange={(e) => setFormData({ ...formData, role_type: e.target.value })}
                required
                className="text-left"
              />
            </div>

            <div>
              <CustomDropdown
                label="Work Type"
                name="work_type"
                options={JOB_WORK_TYPES}
                value={formData.work_type}
                onChange={(e) => setFormData({ ...formData, work_type: e.target.value })}
                required
                className="text-left"
              />
            </div>

            <div>
              <label htmlFor="job-link" className="block text-sm mb-2 text-foreground">
                Job Link <span className="text-red-500">*</span>
              </label>
              <input
                id="job-link"
                type="url"
                value={formData.job_link}
                onChange={(e) => setFormData({ ...formData, job_link: e.target.value })}
                placeholder="https://company.com/jobs/123"
                required
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-foreground">
                Application Deadline <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {!isRollingDeadline && (
                  <DateInput
                    name="deadline"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                )}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRollingDeadline}
                    onChange={(e) => {
                      setIsRollingDeadline(e.target.checked);
                      if (e.target.checked) {
                        setFormData({ ...formData, deadline: '' });
                      }
                    }}
                    className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">Rolling deadline</span>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="company-logo" className="block text-sm mb-2 text-foreground">
                Company Logo URL
              </label>
              <input
                id="company-logo"
                type="url"
                value={formData.companyLogo}
                onChange={(e) => setFormData({ ...formData, companyLogo: e.target.value })}
                placeholder="https://logo.clearbit.com/company.com"
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="company-website" className="block text-sm mb-2 text-foreground">
                Company Website <span className="text-red-500">*</span>
              </label>
              <input
                id="company-website"
                type="url"
                value={formData.companyWebsite}
                onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                placeholder="https://www.company.com"
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="company-description" className="block text-sm mb-2 text-foreground">
                Company Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="company-description"
                value={formData.companyDescription}
                onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
                rows={2}
                placeholder="Brief description about the company"
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
              <div className="flex justify-between items-center">
                <label className="block text-sm text-foreground mb-2">
                  Job Description Sections <span className="text-red-500">*</span>
                </label>
                {formData.descriptionSections.length < 4 && (
                  <button
                    type="button"
                    onClick={addSection}
                    className="px-4 py-2 border border-border rounded-xl hover:bg-secondary text-foreground text-sm"
                  >
                    + Add Section
                  </button>
                )}
              </div>
              
              {formData.descriptionSections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border border-border rounded-xl p-4 space-y-3">
                  <div className="flex gap-2">
                    {sectionIndex === 0 ? (
                      <div className="flex-1 px-4 py-3 bg-input-background border border-input rounded-xl text-foreground font-bold">
                        About the Role
                      </div>
                    ) : (
                      <>
                        <CustomDropdown
                          value={section.header}
                          onChange={(e) => updateSectionHeader(sectionIndex, e.target.value)}
                          options={[
                            { value: 'Responsibilities', label: 'Responsibilities' },
                            { value: 'Requirements', label: 'Requirements' },
                            { value: 'Benefits', label: 'Benefits' }
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
                  
                  <div className="space-y-2 ml-4">
                    <label className="block text-xs text-muted-foreground">Content Items</label>
                    {section.content.map((item, contentIndex) => (
                      <div key={`${sectionIndex}-${contentIndex}`} className="flex gap-2">
                        {section.header === 'About the Role' ? (
                          <textarea
                            value={item}
                            onChange={(e) => updateContentItem(sectionIndex, contentIndex, e.target.value)}
                            placeholder="Full Job Description"
                            rows={3}
                            className="flex-1 px-4 py-2 bg-input-background border border-input rounded-lg text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
                            required
                          />
                        ) : (
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => updateContentItem(sectionIndex, contentIndex, e.target.value)}
                            placeholder="Bullet point"
                            className="flex-1 px-4 py-2 bg-input-background border border-input rounded-lg text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                          />
                        )}
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

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90"
            >
              {isEdit ? 'Update Job Posting' : 'Create Job Posting'}
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
