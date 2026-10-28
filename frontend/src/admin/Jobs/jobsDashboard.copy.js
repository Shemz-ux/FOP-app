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
    active: 'Active Jobs'
  },
  search: {
    placeholder: 'Search jobs by title, company, or location...',
    filterAll: 'All Status',
    filterActive: 'Active',
    filterClosed: 'Closed',
    filterDraft: 'Draft'
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
    statusInactive: 'Inactive',
    emptyTitle: 'No jobs found',
    emptyFiltered: 'Try adjusting your search or filters',
    emptyUnfiltered: 'No jobs have been created yet',
    notAvailable: 'N/A',
    applicantsSuffix: 'applicants',
    tooltips: {
      view: 'View details',
      edit: 'Edit job',
      delete: 'Delete job'
    },
    mobileActions: {
      view: 'View',
      edit: 'Edit'
    }
  },
  loading: 'Loading jobs...',
  deleteConfirm: {
    title: 'Delete Job',
    confirmButton: 'Delete',
    cancelButton: 'Cancel'
  },
  toast: {
    deleteFailed: 'Failed to delete job. Please try again.'
  }
};

export { jobsDashboardCopy };
