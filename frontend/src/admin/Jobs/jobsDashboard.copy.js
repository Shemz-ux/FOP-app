const jobsDashboardCopy = {
  breadcrumb: {
    dashboard: 'Dashboard',
    current: 'Jobs'
  },
  header: {
    title: 'Job Management',
    subtitle: 'Manage all job postings and applications',
    createButton: 'Post New Job'
  },
  stats: {
    total: 'Total Jobs',
    active: 'Active Jobs',
    featured: 'Featured',
    featuredLive: 'live',
    featuredExpired: 'expired',
    // Shown when any featured job is past its deadline. The API leaves is_featured set on
    // those jobs, so without this the count would overstate what members actually see.
    expiredHint: 'past their deadline, so no longer shown on the jobs page',
    clearExpired: 'Clear expired'
  },
  search: {
    placeholder: 'Search jobs by title, company, or location...',
    filterAll: 'All Status',
    filterActive: 'Active',
    filterClosed: 'Closed',
    filterDraft: 'Draft',
    featuredAll: 'All Jobs',
    featuredLive: 'Featured (live)',
    featuredExpired: 'Featured (expired)',
    featuredNone: 'Not featured'
  },
  table: {
    headers: {
      title: 'Job Title',
      company: 'Company',
      location: 'Location',
      applicants: 'Applicants',
      status: 'Status',
      actions: 'Actions'
    },
    statusActive: 'Active',
    statusClosed: 'Closed',
    statusDraft: 'Draft',
    featuredLabel: 'Featured',
    featuredExpiredLabel: 'Featured · expired',
    emptyTitle: 'No jobs found',
    emptyFiltered: 'Try adjusting your search or filters',
    emptyUnfiltered: 'No jobs have been created yet',
    notAvailable: 'N/A',
    applicantsSuffix: 'applicants',
    tooltips: {
      view: 'View details',
      edit: 'Edit job',
      delete: 'Delete job',
      feature: 'Feature on the jobs page',
      unfeature: 'Remove from featured',
      featuredExpired: 'Flagged as featured, but past its deadline so not currently shown'
    },
    mobileActions: {
      view: 'View',
      edit: 'Edit',
      feature: 'Feature',
      featured: 'Featured'
    }
  },
  loading: 'Loading jobs...',
  deleteConfirm: {
    title: 'Delete Job',
    confirmButton: 'Delete',
    cancelButton: 'Cancel'
  },
  clearExpiredConfirm: {
    title: 'Clear expired featured jobs',
    confirmButton: 'Clear',
    cancelButton: 'Cancel'
  },
  toast: {
    deleteFailed: 'Failed to delete job. Please try again.',
    featureFailed: 'Failed to update featured status. Please try again.',
    clearExpiredFailed: 'Failed to clear expired featured jobs. Please try again.',
    clearExpiredNone: 'No expired featured jobs to clear'
  }
};

export { jobsDashboardCopy };
