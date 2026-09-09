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
    { value: 'Technology', label: 'Technology' },
    { value: 'Business', label: 'Business' },
    { value: 'Career Development', label: 'Career Development' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Design', label: 'Design' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Leadership', label: 'Leadership' },
    { value: 'Personal Development', label: 'Personal Development' }
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
