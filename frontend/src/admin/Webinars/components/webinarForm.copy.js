const webinarFormCopy = {
  create: {
    title: 'Post New Webinar',
    subtitle: 'Add a new webinar recording to the library',
    submitButton: 'Post Webinar',
    backButton: 'Back to Webinars'
  },
  edit: {
    title: 'Edit Webinar',
    subtitle: 'Update webinar details and settings',
    submitButton: 'Save Changes',
    backButton: 'Back'
  },
  fields: {
    title: {
      label: 'Webinar Title',
      placeholder: 'Enter webinar title...',
      required: true
    },
    description: {
      label: 'Description',
      placeholder: 'Brief description of the webinar...',
      required: true
    },
    category: {
      label: 'Category',
      placeholder: 'Select category',
      required: true,
      customPlaceholder: 'Enter new category name...',
      addNew: 'Add New Category'
    },
    youtubeUrl: {
      label: 'YouTube Video URL',
      placeholder: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      required: true,
      help: 'Paste the full YouTube video URL'
    },
    thumbnailUrl: {
      label: 'Thumbnail URL',
      placeholder: 'https://i.ytimg.com/vi/VIDEO_ID/maxresdefault.jpg',
      required: false,
      help: 'Leave blank to use default YouTube thumbnail'
    },

    isPublished: {
      label: 'Published',
      help: 'Make this webinar visible to users'
    },
    isFeatured: {
      label: 'Featured',
      help: 'Show this webinar in the featured section'
    }
  },
  categories: [
    { value: 'Career & Commercial Skills', label: 'Career & Commercial Skills' },
    { value: 'CV & Applications', label: 'CV & Applications' },
    { value: 'Employer Insight Events', label: 'Employer Insight Events' },
    { value: 'Industry Insight Events', label: 'Industry Insight Events' },
    { value: 'Interview Prep', label: 'Interview Prep' },
    { value: 'Job Search Strategy', label: 'Job Search Strategy' },
    { value: 'Linkedin & Networking', label: 'Linkedin & Networking' }
  ],
  validation: {
    titleRequired: 'Title is required',
    descriptionRequired: 'Description is required',
    categoryRequired: 'Category is required',
    youtubeUrlRequired: 'YouTube Video URL is required',
    youtubeUrlInvalid: 'Please enter a valid YouTube URL'
  },
  success: {
    created: 'Webinar posted successfully',
    updated: 'Webinar updated successfully'
  },
  error: {
    generic: 'An error occurred. Please try again.'
  }
};

export { webinarFormCopy };
