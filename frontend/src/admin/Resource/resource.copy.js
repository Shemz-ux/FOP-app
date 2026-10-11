// All text for the admin resource screens, one export per page.
import { RESOURCE_FILE_EXTENSIONS, RESOURCE_MAX_FILE_SIZE_MB } from './resourceOptions';

const fileTypeList = RESOURCE_FILE_EXTENSIONS.map(extension => extension.toUpperCase()).join(', ');

// ==================== SHARED ====================

const statusCopy = {
  active: 'Active',
  inactive: 'Inactive'
};

const deleteModalCopy = {
  title: 'Delete Resource',
  message: (title) => `Are you sure you want to delete "${title}"? This action cannot be undone.`,
  confirm: 'Delete',
  cancel: 'Cancel'
};

// Who can see each audience's resources
const audienceDescriptions = {
  public: 'Visible to everyone on the Resources page',
  society: 'Visible only to society accounts'
};

// ==================== RESOURCE MANAGEMENT (list page) ====================

const resourceManagementCopy = {
  loading: 'Loading resources...',
  breadcrumb: {
    dashboard: 'Dashboard',
    current: 'Resources'
  },
  header: {
    title: 'Resource Management',
    subtitle: 'Manage all resources and downloads',
    createButton: 'Upload Resource'
  },
  audienceSwitchLabel: 'Resource audience',
  audienceBanner: {
    public: {
      title: 'Public resources',
      description: audienceDescriptions.public
    },
    society: {
      title: 'Society resources',
      description: audienceDescriptions.society
    }
  },
  status: statusCopy,
  stats: {
    total: 'Total Resources',
    active: 'Active Resources'
  },
  empty: {
    noMatches: 'No resources match your search.',
    noResources: {
      public: 'No public resources yet.',
      society: 'No society resources yet.'
    }
  },
  search: {
    placeholder: 'Search resources by title...',
    filterAll: 'All Categories'
  },
  table: {
    headers: {
      title: 'Title',
      category: 'Category',
      status: 'Status',
      downloads: 'Downloads',
      uploaded: 'Uploaded',
      actions: 'Actions'
    },
    tooltips: {
      view: 'View details',
      edit: 'Edit resource',
      delete: 'Delete resource'
    }
  },
  mobile: {
    downloads: 'downloads',
    view: 'View',
    edit: 'Edit'
  },
  deleteModal: deleteModalCopy,
  toasts: {
    loadError: 'Failed to load resources',
    deleteSuccess: 'Resource deleted successfully',
    deleteError: 'Failed to delete resource'
  }
};

// ==================== RESOURCE DETAIL ====================

const resourceDetailCopy = {
  loading: 'Loading resource...',
  back: 'Back to Resources',
  notFound: {
    title: 'Resource Not Found',
    message: "The resource you're looking for doesn't exist."
  },
  status: statusCopy,
  actions: {
    viewOnWebsite: 'View on Website',
    viewOnWebsiteShort: 'View',
    edit: 'Edit',
    delete: 'Delete'
  },
  info: {
    resourceType: 'Resource Type',
    typeVideo: 'Video Link',
    typeFile: 'File',
    fileSize: 'File Size',
    fileType: 'File Type',
    downloads: 'Downloads/Views',
    createdBy: 'Created By',
    createdByFallback: 'FOP',
    uploadDate: 'Upload Date',
    lastUpdated: 'Last Updated',
    audience: 'Audience',
    status: 'Status'
  },
  access: {
    title: 'Access Resource',
    videoMessage: 'This resource is a video hosted externally.',
    watchVideo: 'Watch Video',
    fileMessage: 'Download or view this resource file.',
    viewResource: 'View Resource',
    downloadResource: 'Download Resource'
  },
  sections: {
    description: 'Short Description',
    detailedDescription: 'About This Resource',
    whatsIncluded: "What's Included"
  },
  deleteModal: deleteModalCopy,
  toasts: {
    deleteSuccess: (title) => `"${title}" has been deleted successfully`,
    deleteError: 'Failed to delete resource. Please try again.',
    viewError: 'Failed to view resource. Please try again.',
    downloadError: 'Failed to download resource. Please try again.'
  }
};

// ==================== RESOURCE FORM (create and edit) ====================

const resourceFormCopy = {
  loading: 'Loading resource...',
  notFound: {
    title: 'Resource Not Found',
    message: "The resource you're trying to edit doesn't exist."
  },
  back: 'Back',
  header: {
    createTitle: 'Upload New Resource',
    editTitle: 'Edit Resource',
    requiredNote: {
      before: 'All fields marked with',
      after: 'are required.'
    }
  },
  fields: {
    audience: {
      label: 'Who is this resource for?',
      helper: audienceDescriptions
    },
    title: {
      label: 'Resource Title'
    },
    category: {
      label: 'Category'
    },
    createdBy: {
      label: 'Created By',
      placeholder: 'e.g. FOP Team, Career Services, Company Name',
      helper: 'Enter the company or person who created this resource'
    },
    description: {
      label: 'Short Description',
      placeholder: 'Brief overview shown in resource cards and at the top of detail page'
    },
    detailedDescription: {
      label: 'Detailed Description',
      placeholder: "Comprehensive description shown in 'About This Resource' section"
    },
    whatsIncluded: {
      label: "What's Included",
      placeholder: 'e.g. • Comprehensive guide with step-by-step instructions',
      remove: 'Remove',
      add: '+ Add Item'
    },
    active: {
      label: 'Set as Active',
      helper: 'Active resources are visible to users'
    },
    uploadType: {
      label: 'Resource Type',
      file: 'File Upload',
      link: 'Video Link'
    },
    file: {
      currentLabel: 'Current File',
      createLabel: 'Upload File',
      editLabel: 'Replace File (Optional)',
      dropPrompt: 'Click to upload or drag and drop',
      hint: `${fileTypeList} files up to ${RESOURCE_MAX_FILE_SIZE_MB}MB`,
      select: 'Select File',
      change: 'Change File',
      remove: 'Remove File',
      selected: (fileName) => `✓ File selected: ${fileName}`
    },
    videoLink: {
      currentLabel: 'Current Video Link',
      label: 'Video Link (YouTube, Vimeo, etc.)',
      placeholder: 'https://www.youtube.com/watch?v=...',
      helper: 'Supported: YouTube, Vimeo, or any direct video link'
    }
  },
  buttons: {
    create: {
      public: 'Upload Public Resource',
      society: 'Upload Society Resource'
    },
    creating: 'Uploading...',
    update: 'Update Resource',
    updating: 'Updating...',
    cancel: 'Cancel'
  },
  validation: {
    categoryRequired: 'Please select a category',
    fileRequired: 'Please select a file to upload',
    videoLinkRequired: 'Please provide a video link',
    fileType: `Invalid file type. Only ${fileTypeList} files are allowed.`,
    fileSize: `File size exceeds ${RESOURCE_MAX_FILE_SIZE_MB}MB limit`
  },
  toasts: {
    loadError: 'Failed to load resource',
    createSuccess: 'Resource has been created successfully!',
    updateSuccess: 'Resource has been updated successfully!',
    createError: 'Failed to create resource. Please try again.',
    updateError: 'Failed to update resource. Please try again.'
  }
};

export { resourceManagementCopy, resourceDetailCopy, resourceFormCopy };
