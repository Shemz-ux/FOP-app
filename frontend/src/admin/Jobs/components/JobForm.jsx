import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { jobFormCopy } from './jobForm.copy';
import { toDateInputValue } from '../../../utils/timeFormatter';
import CustomDropdown from '../../../components/Admin/CustomDropdown';
import SelectWithAddNew from '../../../components/Admin/SelectWithAddNew';
import DateInput from '../../../components/Ui/DateInput';
import Toast from '../../../components/Ui/Toast';
import ImageUploadCard from '../../../components/Admin/ImageUploadCard';
import { JOB_INDUSTRIES, JOB_ROLE_TYPES, JOB_WORK_TYPES, JOB_EXPERIENCE_LEVELS } from '../../../utils/dropdownOptions';
import { parseDescriptionToSections, sectionsToDescription } from '../../../utils/jobDescriptionParser';
import { uploadMedia } from '../../../services/Media/mediaUploadService';
import { jobsService } from '../../../services';

// Marks a required field in a label. Driven by jobFormCopy.fields.*.required so the
// asterisks cannot drift out of step with the copy.
function RequiredMark({ when }) {
  if (!when) return null;
  return <span className="text-red-500 ml-1">*</span>;
}

/**
 * Mode-agnostic job form.
 *
 * Knows nothing about creating vs editing beyond the `isEdit` flag, which selects a copy
 * block and a success message. All persistence, navigation and routing belongs to the
 * JobCreate / JobEdit wrappers, which pass `onSubmit` and `onCancel`.
 */
export function JobForm({ job, onSubmit, onCancel, isEdit = false }) {
  const copy = isEdit ? jobFormCopy.edit : jobFormCopy.create;
  const fields = jobFormCopy.fields;

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
    deadline: toDateInputValue(job?.deadline),
    is_active: job?.is_active !== undefined ? job.is_active : true,
    // Featuring is opt-in, so this defaults to false rather than is_active's true.
    is_featured: job?.is_featured !== undefined ? job.is_featured : false,
    descriptionSections: job?.description_sections || parseDescriptionToSections(job?.description) || [
      { header: 'About the Role', content: [''] },
      { header: 'Responsibilities', content: [''] },
      { header: 'Requirements', content: [''] },
      { header: 'Benefits', content: [''] },
    ],
  });

  const [logoFile, setLogoFile] = React.useState(null);
  const [logoPreview, setLogoPreview] = React.useState(job?.company_logo || null);
  const [isRollingDeadline, setIsRollingDeadline] = React.useState(!job?.deadline);
  const [toast, setToast] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);
  const [locationOptions, setLocationOptions] = React.useState([]);

  // Suggest existing locations (including ones only used by inactive jobs, so an admin can
  // reuse an existing spelling) while still allowing a brand-new city to be typed freely.
  React.useEffect(() => {
    const loadLocationOptions = async () => {
      try {
        const filterOptions = await jobsService.getJobFilters({ includeInactive: true });
        setLocationOptions(filterOptions?.locations || []);
      } catch (err) {
        console.error('Error loading location options:', err);
      }
    };
    loadLocationOptions();
  }, []);

  React.useEffect(() => {
    if (job) {
      setLogoPreview(job.company_logo || null);
    }
  }, [job]);

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
    setFormData({ ...formData, companyLogo: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUploading(true);

      // Upload logo to Cloudinary if a new file is selected
      let logoUrl = formData.companyLogo || logoPreview;
      if (logoFile) {
        const logoUploadResult = await uploadMedia(
          logoFile,
          'company_logo',
          isEdit ? job?.company_logo : null
        );

        if (!logoUploadResult.success) {
          throw new Error(logoUploadResult.error || jobFormCopy.error.logoUploadFailed);
        }

        logoUrl = logoUploadResult.data.url;
      }

      // Convert descriptionSections to description string with proper formatting
      const descriptionText = sectionsToDescription(formData.descriptionSections);

      const jobData = {
        title: formData.title,
        company: formData.company,
        company_color: formData.companyColor,
        company_logo: logoUrl,
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
        is_featured: formData.is_featured,
        description_sections: formData.descriptionSections
      };

      await onSubmit(jobData);
      setToast({
        message: isEdit ? jobFormCopy.success.updated : jobFormCopy.success.created,
        type: 'success'
      });
    } catch (error) {
      console.error('Error submitting job:', error);

      const errorMessage = error.response?.data?.message
        || error.message
        || (isEdit ? jobFormCopy.error.updateFailed : jobFormCopy.error.createFailed);

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
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-7xl">
        <div className="space-y-4 sm:space-y-6 text-left">
          {/* Back Button */}
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{copy.backButton}</span>
          </button>

          {/* Header */}
          <h1 className="text-2xl sm:text-3xl text-foreground mb-2">{copy.title}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">{copy.subtitle}</p>

          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              duration={5000}
              onClose={() => setToast(null)}
            />
          )}

          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 text-left overflow-hidden">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="job-title" className="block text-sm mb-2 text-foreground">
                    {fields.title.label}<RequiredMark when={fields.title.required} />
                  </label>
                  <input
                    id="job-title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required={fields.title.required}
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm mb-2 text-foreground">
                    {fields.company.label}<RequiredMark when={fields.company.required} />
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required={fields.company.required}
                  />
                </div>

                <div>
                  <CustomDropdown
                    label={fields.industry.label}
                    name="industry"
                    options={JOB_INDUSTRIES}
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    required={fields.industry.required}
                    className="text-left"
                  />
                </div>

                <div>
                  <SelectWithAddNew
                    label={fields.location.label}
                    name="location"
                    required={fields.location.required}
                    options={locationOptions.map((loc) => ({ value: loc, label: loc }))}
                    value={formData.location}
                    onValueChange={(value) => setFormData({ ...formData, location: value })}
                    placeholder={fields.location.placeholder}
                    addNewLabel={fields.location.addNew}
                    customPlaceholder={fields.location.customPlaceholder}
                    backLabel={fields.location.back}
                  />
                </div>

                <div>
                  <CustomDropdown
                    label={fields.experienceLevel.label}
                    name="experience_level"
                    options={JOB_EXPERIENCE_LEVELS}
                    value={formData.experience_level}
                    onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                    required={fields.experienceLevel.required}
                    className="text-left"
                  />
                </div>

                <div>
                  <CustomDropdown
                    label={fields.roleType.label}
                    name="role_type"
                    options={JOB_ROLE_TYPES}
                    value={formData.role_type}
                    onChange={(e) => setFormData({ ...formData, role_type: e.target.value })}
                    required={fields.roleType.required}
                    className="text-left"
                  />
                </div>

                <div>
                  <CustomDropdown
                    label={fields.workType.label}
                    name="work_type"
                    options={JOB_WORK_TYPES}
                    value={formData.work_type}
                    onChange={(e) => setFormData({ ...formData, work_type: e.target.value })}
                    required={fields.workType.required}
                    className="text-left"
                  />
                </div>

                <div>
                  <label htmlFor="job-link" className="block text-sm mb-2 text-foreground">
                    {fields.jobLink.label}<RequiredMark when={fields.jobLink.required} />
                  </label>
                  <input
                    id="job-link"
                    type="url"
                    value={formData.job_link}
                    onChange={(e) => setFormData({ ...formData, job_link: e.target.value })}
                    placeholder={fields.jobLink.placeholder}
                    required={fields.jobLink.required}
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-foreground">
                    {fields.deadline.label}<RequiredMark when={fields.deadline.required} />
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
                      <span className="text-sm text-foreground">{fields.deadline.rollingLabel}</span>
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <ImageUploadCard
                    imagePreview={logoPreview}
                    imageFile={logoFile}
                    onImageChange={handleLogoChange}
                    onRemoveImage={handleRemoveLogo}
                    label={fields.companyLogo.label}
                    required={fields.companyLogo.required}
                    variant="logo"
                  />
                </div>

                <div>
                  <label htmlFor="company-website" className="block text-sm mb-2 text-foreground">
                    {fields.companyWebsite.label}<RequiredMark when={fields.companyWebsite.required} />
                  </label>
                  <input
                    id="company-website"
                    type="url"
                    value={formData.companyWebsite}
                    onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                    placeholder={fields.companyWebsite.placeholder}
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required={fields.companyWebsite.required}
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="company-description" className="block text-sm mb-2 text-foreground">
                    {fields.companyDescription.label}<RequiredMark when={fields.companyDescription.required} />
                  </label>
                  <textarea
                    id="company-description"
                    value={formData.companyDescription}
                    onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
                    rows={2}
                    placeholder={fields.companyDescription.placeholder}
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    required={fields.companyDescription.required}
                  />
                </div>

                <div className="md:col-span-2 space-y-6">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm text-foreground mb-2">
                      {fields.descriptionSections.label}<RequiredMark when={fields.descriptionSections.required} />
                    </label>
                    {formData.descriptionSections.length < jobFormCopy.maxSections && (
                      <button
                        type="button"
                        onClick={addSection}
                        className="px-4 py-2 border border-border rounded-xl hover:bg-secondary text-foreground text-sm"
                      >
                        {fields.descriptionSections.addSection}
                      </button>
                    )}
                  </div>

                  {formData.descriptionSections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="border border-border rounded-xl p-4 space-y-3">
                      <div className="flex gap-2">
                        {sectionIndex === 0 ? (
                          <div className="flex-1 px-4 py-3 bg-input-background border border-input rounded-xl text-foreground font-bold">
                            {jobFormCopy.aboutSectionHeader}
                          </div>
                        ) : (
                          <>
                            <CustomDropdown
                              value={section.header}
                              onChange={(e) => updateSectionHeader(sectionIndex, e.target.value)}
                              options={jobFormCopy.sectionTypes}
                              placeholder={fields.descriptionSections.selectSectionType}
                              className="flex-1 font-bold"
                            />
                            <button
                              type="button"
                              onClick={() => removeSection(sectionIndex)}
                              className="px-4 py-3 border border-border rounded-xl hover:bg-secondary text-muted-foreground"
                            >
                              {fields.descriptionSections.removeSection}
                            </button>
                          </>
                        )}
                      </div>

                      <div className="space-y-2 ml-4">
                        <label className="block text-xs text-muted-foreground">
                          {fields.descriptionSections.contentItems}
                        </label>
                        {section.content.map((item, contentIndex) => (
                          <div key={`${sectionIndex}-${contentIndex}`} className="flex gap-2">
                            {section.header === jobFormCopy.aboutSectionHeader ? (
                              <textarea
                                value={item}
                                onChange={(e) => updateContentItem(sectionIndex, contentIndex, e.target.value)}
                                placeholder={fields.descriptionSections.aboutPlaceholder}
                                rows={3}
                                className="flex-1 px-4 py-2 bg-input-background border border-input rounded-lg text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
                                required
                              />
                            ) : (
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => updateContentItem(sectionIndex, contentIndex, e.target.value)}
                                placeholder={fields.descriptionSections.bulletPlaceholder}
                                className="flex-1 px-4 py-2 bg-input-background border border-input rounded-lg text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                              />
                            )}
                            {section.content.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeContentItem(sectionIndex, contentIndex)}
                                className="px-3 py-2 border border-border rounded-lg hover:bg-secondary text-muted-foreground text-sm"
                              >
                                {fields.descriptionSections.removeItem}
                              </button>
                            )}
                          </div>
                        ))}
                        {section.header !== jobFormCopy.aboutSectionHeader && (
                          <button
                            type="button"
                            onClick={() => addContentItem(sectionIndex)}
                            className="px-3 py-1.5 border border-border rounded-lg hover:bg-secondary text-foreground text-xs"
                          >
                            {fields.descriptionSections.addItem}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Active toggle */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-xl">
                    <input
                      type="checkbox"
                      id="is_active"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                    />
                    <div>
                      <label htmlFor="is_active" className="text-sm text-foreground cursor-pointer">
                        {fields.isActive.label}
                      </label>
                      <p className="text-xs text-muted-foreground">{fields.isActive.help}</p>
                    </div>
                  </div>
                </div>

                {/* Featured toggle */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-xl">
                    <input
                      type="checkbox"
                      id="is_featured"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                    />
                    <div>
                      <label htmlFor="is_featured" className="text-sm text-foreground cursor-pointer">
                        {fields.isFeatured.label}
                      </label>
                      <p className="text-xs text-muted-foreground">{fields.isFeatured.help}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? copy.submittingButton : copy.submitButton}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={uploading}
                  className="px-6 py-3 border border-border rounded-xl hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {copy.cancelButton}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
