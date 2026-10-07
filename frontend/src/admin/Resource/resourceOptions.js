// Source of truth for resource dropdown options.
// Used by the admin resource screens and the public Resources pages.
//
// value      - stored in the database, never change for an existing category
// label      - shown in dropdowns, filters and chips
// variant    - JobBadge colour on the public Resources pages
// icon       - icon name on the public Resources pages
// badgeClass - badge colour on the admin screens
// audience   - set when a category can only be used for one audience

export const RESOURCE_CATEGORIES = [
  { value: 'CV', label: 'CV', variant: 'sky', icon: 'FileText', badgeClass: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  { value: 'Cover Letters', label: 'Cover Letters', variant: 'blue', icon: 'FileText', badgeClass: 'bg-green-500/10 text-green-500 border-green-500/20' },
  { value: 'Interviews', label: 'Interviews', variant: 'green', icon: 'MessageSquare', badgeClass: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  { value: 'Assessment Centres', label: 'Assessment Centres', variant: 'emerald', icon: 'Users', badgeClass: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
  { value: 'LinkedIn', label: 'LinkedIn', variant: 'blue', icon: 'Linkedin', badgeClass: 'bg-teal-500/10 text-teal-500 border-teal-500/20' },
  { value: 'Graduate Schemes', label: 'Graduate Schemes', variant: 'indigo', icon: 'Award', badgeClass: 'bg-pink-500/10 text-pink-500 border-pink-500/20' },
  { value: 'Networking', label: 'Networking', variant: 'pink', icon: 'Users', badgeClass: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' },
  { value: 'Career Planning', label: 'Career Planning', variant: 'pink', icon: 'Map', badgeClass: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' },
  { value: 'Industry Insights', label: 'Industry Insights', variant: 'cyan', icon: 'TrendingUp', badgeClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  { value: 'Internship Guides', label: 'Internship Guides', variant: 'violet', icon: 'Briefcase', badgeClass: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
  { value: 'Personal Branding', label: 'Personal Branding', variant: 'fuchsia', icon: 'User', badgeClass: 'bg-violet-500/10 text-violet-500 border-violet-500/20' },
  { value: 'Salary & Benefits', label: 'Salary & Benefits', variant: 'amber', icon: 'DollarSign', badgeClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  { value: 'Skills Development', label: 'Skills Development', variant: 'orange', icon: 'BookOpen', badgeClass: 'bg-lime-500/10 text-lime-500 border-lime-500/20' },
  { value: 'First Job', label: 'First Job', variant: 'sky', icon: 'Rocket', badgeClass: 'bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/20' },
  { value: 'Remote Work', label: 'Remote Work', variant: 'emerald', icon: 'Home', badgeClass: 'bg-sky-500/10 text-sky-500 border-sky-500/20' },
  { value: 'Career Workshops', label: 'Career Workshops', variant: 'amber', icon: 'BookOpen', badgeClass: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', audience: 'society' },
];

// Badge colour for categories that are not in the list above
export const DEFAULT_CATEGORY_BADGE_CLASS = 'bg-purple-500/10 text-purple-500 border-purple-500/20';

// Who can see a resource. Values match the audience column in the database
export const RESOURCE_AUDIENCES = [
  { value: 'public', label: 'Public' },
  { value: 'society', label: 'Society only' },
];

// Categories shown in the resources section of the society profile
export const SOCIETY_RESOURCES_CATEGORIES = ['Career Workshops', 'CV', 'Cover Letters', 'Interviews'];

// File extensions the API accepts, and the upload size limit
export const RESOURCE_FILE_EXTENSIONS = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'rtf'];
export const RESOURCE_MAX_FILE_SIZE_MB = 50;

export const UPLOAD_TYPES = {
  file: 'file',
  link: 'link',
};

export const getResourceCategory = (value) => {
  return RESOURCE_CATEGORIES.find(category => category.value === value);
};

// Categories that can be used for the given audience
export const getCategoriesForAudience = (audience) => {
  return RESOURCE_CATEGORIES.filter(category => !category.audience || category.audience === audience);
};

// A resource is a video link when it has the video file type or a known video host URL
export const isVideoResource = (resource) => {
  if (!resource) return false;
  return Boolean(
    resource.file_type?.toLowerCase().includes('video') ||
    resource.storage_url?.includes('youtube.com') ||
    resource.storage_url?.includes('vimeo.com') ||
    resource.storage_url?.includes('youtu.be')
  );
};
