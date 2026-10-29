const jobFormCopy = {
  create: {
    title: 'Create Job Posting',
    subtitle: 'All fields marked with * must be filled, otherwise the job will not be posted.',
    submitButton: 'Create Job Posting',
    submittingButton: 'Uploading...',
    cancelButton: 'Cancel',
    backButton: 'Back'
  },
  edit: {
    title: 'Edit Job Posting',
    subtitle: 'All fields marked with * must be filled, otherwise the job will not be posted.',
    submitButton: 'Update Job Posting',
    submittingButton: 'Uploading...',
    cancelButton: 'Cancel',
    backButton: 'Back'
  },
  fields: {
    title: {
      label: 'Job Title',
      required: true
    },
    company: {
      label: 'Company',
      required: true
    },
    industry: {
      label: 'Industry',
      required: true
    },
    location: {
      label: 'Location',
      required: true,
      placeholder: 'Select a location',
      addNew: 'Add new location',
      customPlaceholder: 'e.g. London',
      back: '← Back to locations'
    },
    experienceLevel: {
      label: 'Experience Level',
      required: true
    },
    roleType: {
      label: 'Role Type',
      required: true
    },
    workType: {
      label: 'Work Type',
      required: true
    },
    jobLink: {
      label: 'Job Link',
      placeholder: 'https://company.com/jobs/123',
      required: true
    },
    deadline: {
      label: 'Application Deadline',
      required: true,
      rollingLabel: 'Rolling deadline'
    },
    companyLogo: {
      label: 'Company Logo (optional)',
      required: false
    },
    companyWebsite: {
      label: 'Company Website',
      placeholder: 'https://www.company.com',
      required: true
    },
    companyDescription: {
      label: 'Company Description',
      placeholder: 'Brief description about the company',
      required: true
    },
    descriptionSections: {
      label: 'Job Description Sections',
      required: true,
      addSection: '+ Add Section',
      removeSection: 'Remove Section',
      selectSectionType: 'Select section type',
      contentItems: 'Content Items',
      aboutPlaceholder: 'Full Job Description',
      bulletPlaceholder: 'Bullet point',
      addItem: '+ Add Item',
      removeItem: 'Remove'
    },
    isActive: {
      label: 'Set job posting as active',
      help: 'Inactive postings are hidden from the public jobs page.'
    },
    isFeatured: {
      label: 'Feature this job on the jobs page',
      help: 'Featured jobs appear in the Featured Jobs section at the top of the public jobs page. Jobs past their deadline drop out of that section automatically.'
    }
  },
  sectionTypes: [
    { value: 'Responsibilities', label: 'Responsibilities' },
    { value: 'Requirements', label: 'Requirements' },
    { value: 'Benefits', label: 'Benefits' }
  ],
  aboutSectionHeader: 'About the Role',
  maxSections: 4,
  success: {
    created: 'Job posting has been created successfully!',
    updated: 'Job posting has been updated successfully!'
  },
  error: {
    createFailed: 'Failed to create job. Please try again.',
    updateFailed: 'Failed to update job. Please try again.',
    logoUploadFailed: 'Failed to upload logo to Cloudinary'
  }
};

export { jobFormCopy };
