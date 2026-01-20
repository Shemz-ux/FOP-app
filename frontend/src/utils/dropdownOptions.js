// Dropdown options for admin forms with color variants and icon mappings
// Supports predefined options + "Other" for custom entries

// ==================== RESOURCES ====================

export const RESOURCE_CATEGORIES = [
  // Application Materials
  { value: 'CV', label: 'CV', variant: 'sky', icon: 'FileText' },
  { value: 'Cover Letters', label: 'Cover Letters', variant: 'blue', icon: 'FileText' },
  { value: 'Application Forms', label: 'Applications', variant: 'teal', icon: 'ClipboardList' },
  { value: 'Personal Statements', label: 'Personal Statement', variant: 'indigo', icon: 'FileEdit' },
  { value: 'Portfolio Building', label: 'Portfolio', variant: 'violet', icon: 'Briefcase' },
  
  // Interview & Assessment
  { value: 'Interviews', label: 'Interviews', variant: 'green', icon: 'MessageSquare' },
  { value: 'Assessment Centres', label: 'Assessment Centre', variant: 'emerald', icon: 'Users' },
  { value: 'Aptitude Tests', label: 'Aptitude Tests', variant: 'cyan', icon: 'Brain' },
  { value: 'Group Exercises', label: 'Group Exercise', variant: 'teal', icon: 'UsersRound' },
  
  // Career Development
  { value: 'Career Tips', label: 'Career Tips', variant: 'purple', icon: 'Lightbulb' },
  { value: 'Career Planning', label: 'Career Planning', variant: 'pink', icon: 'Map' },
  { value: 'Skills Development', label: 'Skills Dev', variant: 'orange', icon: 'BookOpen' },
  { value: 'Professional Development', label: 'Professional Dev', variant: 'amber', icon: 'GraduationCap' },
  { value: 'Mentorship', label: 'Mentorship', variant: 'rose', icon: 'UserCheck' },
  
  // Industry & Opportunities
  { value: 'Industry Insights', label: 'Industry Insights', variant: 'cyan', icon: 'TrendingUp' },
  { value: 'Company Research', label: 'Company Research', variant: 'blue', icon: 'Building' },
  { value: 'Graduate Schemes', label: 'Grad Schemes', variant: 'indigo', icon: 'Award' },
  { value: 'Internship Guides', label: 'Internship Guide', variant: 'violet', icon: 'Briefcase' },
  { value: 'Apprenticeships', label: 'Apprenticeships', variant: 'emerald', icon: 'Tool' },
  
  // Networking & Personal Brand
  { value: 'Networking', label: 'Networking', variant: 'pink', icon: 'Users' },
  { value: 'LinkedIn', label: 'LinkedIn', variant: 'blue', icon: 'Linkedin' },
  { value: 'Personal Branding', label: 'Personal Brand', variant: 'fuchsia', icon: 'User' },
  { value: 'Social Media', label: 'Social Media', variant: 'purple', icon: 'Share2' },
  
  // Practical Resources
  { value: 'Job Search', label: 'Job Search', variant: 'rose', icon: 'Search' },
  { value: 'Salary & Benefits', label: 'Salary & Benefits', variant: 'amber', icon: 'DollarSign' },
  { value: 'Negotiation', label: 'Negotiation', variant: 'orange', icon: 'Handshake' },
  { value: 'Work-Life Balance', label: 'Work-Life Balance', variant: 'lime', icon: 'Heart' },
  { value: 'Remote Work', label: 'Remote Work', variant: 'emerald', icon: 'Home' },
  { value: 'First Job', label: 'First Job', variant: 'sky', icon: 'Rocket' },
  
  // Templates & Tools
  { value: 'Templates', label: 'Templates', variant: 'indigo', icon: 'Layout' },
  { value: 'Guides', label: 'Guides', variant: 'violet', icon: 'BookOpen' },
  { value: 'Checklists', label: 'Checklists', variant: 'emerald', icon: 'CheckSquare' },
  { value: 'Worksheets', label: 'Worksheets', variant: 'cyan', icon: 'FileSpreadsheet' },
  
  { value: 'Other', label: 'Other', variant: 'gray', icon: 'File' }
];

export const RESOURCE_FILE_TYPES = [
  { value: 'pdf', label: 'PDF Document', icon: 'FileText' },
  { value: 'docx', label: 'Word Document', icon: 'FileText' },
  { value: 'xlsx', label: 'Excel Spreadsheet', icon: 'Sheet' },
  { value: 'pptx', label: 'PowerPoint Presentation', icon: 'Presentation' },
  { value: 'zip', label: 'ZIP Archive', icon: 'Archive' },
  { value: 'mp4', label: 'Video (MP4)', icon: 'Video' },
  { value: 'png', label: 'Image (PNG)', icon: 'Image' },
  { value: 'jpg', label: 'Image (JPG)', icon: 'Image' },
  { value: 'Other', label: 'Other', icon: 'File' }
];

// ==================== EVENTS ====================

export const EVENT_INDUSTRIES = [
  // Tech & Digital
  { value: 'Technology', label: 'Technology', variant: 'blue' },
  { value: 'Software Development', label: 'Software', variant: 'sky' },
  { value: 'Data Science', label: 'Data Science', variant: 'cyan' },
  { value: 'Cybersecurity', label: 'Cybersecurity', variant: 'indigo' },
  { value: 'AI & Machine Learning', label: 'AI/ML', variant: 'violet' },
  
  // Finance & Business
  { value: 'Finance', label: 'Finance', variant: 'green' },
  { value: 'Accounting', label: 'Accounting', variant: 'emerald' },
  { value: 'Investment Banking', label: 'Investment Banking', variant: 'teal' },
  { value: 'Consulting', label: 'Consulting', variant: 'purple' },
  { value: 'Management', label: 'Management', variant: 'pink' },
  
  // Engineering & Science
  { value: 'Engineering', label: 'Engineering', variant: 'orange' },
  { value: 'Civil Engineering', label: 'Civil Eng.', variant: 'amber' },
  { value: 'Mechanical Engineering', label: 'Mechanical Eng.', variant: 'yellow' },
  { value: 'Electrical Engineering', label: 'Electrical Eng.', variant: 'lime' },
  { value: 'Chemical Engineering', label: 'Chemical Eng.', variant: 'rose' },
  { value: 'Research & Development', label: 'R&D', variant: 'fuchsia' },
  
  // Creative & Media
  { value: 'Marketing', label: 'Marketing', variant: 'pink' },
  { value: 'Media', label: 'Media', variant: 'yellow' },
  { value: 'Design', label: 'Design', variant: 'purple' },
  { value: 'Content Creation', label: 'Content', variant: 'rose' },
  { value: 'Public Relations', label: 'PR', variant: 'fuchsia' },
  
  // Professional Services
  { value: 'Law', label: 'Law', variant: 'indigo' },
  { value: 'Human Resources', label: 'HR', variant: 'cyan' },
  { value: 'Real Estate', label: 'Real Estate', variant: 'teal' },
  { value: 'Insurance', label: 'Insurance', variant: 'slate' },
  
  // Healthcare & Life Sciences
  { value: 'Healthcare', label: 'Healthcare', variant: 'red' },
  { value: 'Pharmaceuticals', label: 'Pharma', variant: 'pink' },
  { value: 'Biotechnology', label: 'Biotech', variant: 'purple' },
  { value: 'Medical Devices', label: 'Med Devices', variant: 'rose' },
  
  // Public Sector & Non-Profit
  { value: 'Education', label: 'Education', variant: 'cyan' },
  { value: 'Government', label: 'Government', variant: 'blue' },
  { value: 'Non-Profit', label: 'Non-Profit', variant: 'green' },
  { value: 'Social Work', label: 'Social Work', variant: 'emerald' },
  
  // Other Industries
  { value: 'Retail', label: 'Retail', variant: 'teal' },
  { value: 'Hospitality', label: 'Hospitality', variant: 'amber' },
  { value: 'Manufacturing', label: 'Manufacturing', variant: 'slate' },
  { value: 'Construction', label: 'Construction', variant: 'orange' },
  { value: 'Energy', label: 'Energy', variant: 'yellow' },
  { value: 'Transport', label: 'Transport', variant: 'stone' },
  { value: 'Agriculture', label: 'Agriculture', variant: 'lime' },
  { value: 'Entertainment', label: 'Entertainment', variant: 'fuchsia' },
  { value: 'Sports', label: 'Sports', variant: 'sky' },
  
  { value: 'General', label: 'General', variant: 'gray' },
  { value: 'Other', label: 'Other', variant: 'gray' }
];

export const EVENT_TYPES = [
  { value: 'Career Fair', label: 'Career Fair', variant: 'blue' },
  { value: 'Networking', label: 'Networking', variant: 'purple' },
  { value: 'Workshop', label: 'Workshop', variant: 'green' },
  { value: 'Panel Discussion', label: 'Panel Discussion', variant: 'orange' },
  { value: 'Seminar', label: 'Seminar', variant: 'pink' },
  { value: 'conference', label: 'Conference', variant: 'red' },
  { value: 'Webinar', label: 'Webinar', variant: 'cyan' },
  { value: 'Meetup', label: 'Meetup', variant: 'teal' },
  { value: 'Other', label: 'Other', variant: 'gray' }
];

export const EVENT_LOCATION_TYPES = [
  { value: 'Online', label: 'Online', variant: 'emerald' },
  { value: 'In_person', label: 'In Person', variant: 'amber' },
  { value: 'Hybrid', label: 'Hybrid', variant: 'violet' },
  { value: 'Other', label: 'Other', variant: 'gray' }
];

// ==================== JOBS ====================

export const JOB_INDUSTRIES = [
  // Tech & Digital
  { value: 'Technology', label: 'Technology', variant: 'blue' },
  { value: 'Software Development', label: 'Software', variant: 'sky' },
  { value: 'Data Science', label: 'Data Science', variant: 'cyan' },
  { value: 'Cybersecurity', label: 'Cybersecurity', variant: 'indigo' },
  { value: 'AI & Machine Learning', label: 'AI/ML', variant: 'violet' },
  
  // Finance & Business
  { value: 'Finance', label: 'Finance', variant: 'green' },
  { value: 'Accounting', label: 'Accounting', variant: 'emerald' },
  { value: 'Investment Banking', label: 'Investment Banking', variant: 'teal' },
  { value: 'Consulting', label: 'Consulting', variant: 'purple' },
  { value: 'Management', label: 'Management', variant: 'pink' },
  
  // Engineering & Science
  { value: 'Engineering', label: 'Engineering', variant: 'orange' },
  { value: 'Civil Engineering', label: 'Civil Eng.', variant: 'amber' },
  { value: 'Mechanical Engineering', label: 'Mechanical Eng.', variant: 'yellow' },
  { value: 'Electrical Engineering', label: 'Electrical Eng.', variant: 'lime' },
  { value: 'Chemical Engineering', label: 'Chemical Eng.', variant: 'rose' },
  { value: 'Research & Development', label: 'R&D', variant: 'fuchsia' },
  
  // Creative & Media
  { value: 'Marketing', label: 'Marketing', variant: 'pink' },
  { value: 'Media', label: 'Media', variant: 'yellow' },
  { value: 'Design', label: 'Design', variant: 'purple' },
  { value: 'Content Creation', label: 'Content', variant: 'rose' },
  { value: 'Public Relations', label: 'PR', variant: 'fuchsia' },
  
  // Professional Services
  { value: 'Law', label: 'Law', variant: 'indigo' },
  { value: 'Human Resources', label: 'HR', variant: 'cyan' },
  { value: 'Real Estate', label: 'Real Estate', variant: 'teal' },
  { value: 'Insurance', label: 'Insurance', variant: 'slate' },
  
  // Healthcare & Life Sciences
  { value: 'Healthcare', label: 'Healthcare', variant: 'red' },
  { value: 'Pharmaceuticals', label: 'Pharma', variant: 'pink' },
  { value: 'Biotechnology', label: 'Biotech', variant: 'purple' },
  { value: 'Medical Devices', label: 'Med Devices', variant: 'rose' },
  
  // Public Sector & Non-Profit
  { value: 'Education', label: 'Education', variant: 'cyan' },
  { value: 'Government', label: 'Government', variant: 'blue' },
  { value: 'Non-Profit', label: 'Non-Profit', variant: 'green' },
  { value: 'Social Work', label: 'Social Work', variant: 'emerald' },
  
  // Other Industries
  { value: 'Retail', label: 'Retail', variant: 'teal' },
  { value: 'Hospitality', label: 'Hospitality', variant: 'amber' },
  { value: 'Manufacturing', label: 'Manufacturing', variant: 'slate' },
  { value: 'Construction', label: 'Construction', variant: 'orange' },
  { value: 'Energy', label: 'Energy', variant: 'yellow' },
  { value: 'Transport', label: 'Transport', variant: 'stone' },
  { value: 'Agriculture', label: 'Agriculture', variant: 'lime' },
  { value: 'Entertainment', label: 'Entertainment', variant: 'fuchsia' },
  { value: 'Sports', label: 'Sports', variant: 'sky' },
  
  { value: 'General', label: 'General', variant: 'gray' },
  { value: 'Other', label: 'Other', variant: 'gray' }
];

export const JOB_ROLE_TYPES = [
  // Student & Graduate Opportunities
  { value: 'Internship', label: 'Internship', variant: 'cyan' },
  { value: 'Spring Week', label: 'Spring Week', variant: 'sky' },
  { value: 'Placement', label: 'Placement', variant: 'pink' },
  { value: 'Graduate Scheme', label: 'Graduate Scheme', variant: 'purple' },
  { value: 'Apprenticeship', label: 'Apprenticeship', variant: 'teal' },
  { value: 'Degree Apprentice', label: 'Degree Apprentice', variant: 'emerald' },
  { value: 'Insight Day', label: 'Insight Day', variant: 'lime' },
  { value: 'Work Experience', label: 'Work Experience', variant: 'amber' },
  { value: 'Vac Scheme', label: 'Vac Scheme', variant: 'orange' },
  
  // Standard Employment
  { value: 'Full-time', label: 'Full-time', variant: 'green' },
  { value: 'Part-time', label: 'Part-time', variant: 'yellow' },
  { value: 'Contract', label: 'Contract', variant: 'gray' },
  { value: 'Freelance', label: 'Freelance', variant: 'slate' },
  { value: 'Temporary', label: 'Temporary', variant: 'stone' },
  { value: 'Seasonal', label: 'Seasonal', variant: 'zinc' },
  
  { value: 'Other', label: 'Other', variant: 'gray' }
];

export const JOB_WORK_TYPES = [
  { value: 'Remote', label: 'Remote', variant: 'emerald' },
  { value: 'Hybrid', label: 'Hybrid', variant: 'violet' },
  { value: 'On-site', label: 'On-site', variant: 'amber' },
  { value: 'Other', label: 'Other', variant: 'gray' }
];

export const JOB_EXPERIENCE_LEVELS = [
  // Student & Early Career
  { value: 'School Leaver', label: 'School Leaver', variant: 'sky' },
  { value: 'Student', label: 'Student', variant: 'cyan' },
  { value: 'Graduate', label: 'Graduate', variant: 'violet' },
  { value: 'Entry Level', label: 'Entry Level', variant: 'purple' },
  
  // Experienced
  { value: 'Mid Level', label: 'Mid Level', variant: 'rose' },
  { value: 'Senior', label: 'Senior', variant: 'orange' },
  { value: 'Lead', label: 'Lead', variant: 'amber' },
  { value: 'Principal', label: 'Principal', variant: 'red' },
  { value: 'Director', label: 'Director', variant: 'emerald' },
  
  { value: 'Other', label: 'Other', variant: 'gray' }
];

// ==================== HELPER FUNCTIONS ====================

/**
 * Get variant for a value from dropdown options
 * Returns default 'gray' if value is custom or not found
 */
export const getVariantFromOptions = (options, value) => {
  const option = options.find(opt => opt.value === value);
  return option?.variant || 'gray';
};

/**
 * Get icon for a value from dropdown options
 * Returns default 'File' if value is custom or not found
 */
export const getIconFromOptions = (options, value) => {
  const option = options.find(opt => opt.value === value);
  return option?.icon || 'File';
};

/**
 * Check if a value is a custom entry (not in predefined options)
 */
export const isCustomEntry = (options, value) => {
  return !options.some(opt => opt.value === value && opt.value !== 'Other');
};

/**
 * Validate and normalize field value
 * If "Other" is selected, expects customValue to be provided
 */
export const normalizeFieldValue = (selectedValue, customValue = '') => {
  if (selectedValue === 'Other' && customValue.trim()) {
    return customValue.trim();
  }
  return selectedValue;
};

// ==================== FORM HELPERS ====================

/**
 * Get all dropdown options for admin forms
 */
export const getDropdownOptions = () => ({
  resources: {
    categories: RESOURCE_CATEGORIES,
    fileTypes: RESOURCE_FILE_TYPES
  },
  events: {
    industries: EVENT_INDUSTRIES,
    eventTypes: EVENT_TYPES,
    locationTypes: EVENT_LOCATION_TYPES
  },
  jobs: {
    industries: JOB_INDUSTRIES,
    roleTypes: JOB_ROLE_TYPES,
    workTypes: JOB_WORK_TYPES,
    experienceLevels: JOB_EXPERIENCE_LEVELS
  }
});

/**
 * Get simple value arrays for basic dropdowns (no variants)
 */
export const getSimpleOptions = (options) => {
  return options.map(opt => opt.value);
};

/**
 * Get label for a value
 */
export const getLabelFromOptions = (options, value) => {
  const option = options.find(opt => opt.value === value);
  return option?.label || value;
};

// ==================== EXPORTS ====================

export default {
  // Resources
  RESOURCE_CATEGORIES,
  RESOURCE_FILE_TYPES,
  
  // Events
  EVENT_INDUSTRIES,
  EVENT_TYPES,
  EVENT_LOCATION_TYPES,
  
  // Jobs
  JOB_INDUSTRIES,
  JOB_ROLE_TYPES,
  JOB_WORK_TYPES,
  JOB_EXPERIENCE_LEVELS,
  
  // Helpers
  getVariantFromOptions,
  getIconFromOptions,
  isCustomEntry,
  normalizeFieldValue,
  getDropdownOptions,
  getSimpleOptions,
  getLabelFromOptions
};
