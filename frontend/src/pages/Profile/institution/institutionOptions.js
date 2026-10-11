// Settings for the institution (society) profile.
import { Bookmark, BookOpen, Users } from 'lucide-react';

// Sections of the profile, in the order of the tab bar. The active one is kept in the URL (?tab=)
export const INSTITUTION_SECTIONS = {
  members: 'members',
  saved: 'saved',
  resources: 'resources',
};

export const DEFAULT_INSTITUTION_SECTION = INSTITUTION_SECTIONS.members;

export const INSTITUTION_SECTION_ICONS = {
  members: Users,
  saved: Bookmark,
  resources: BookOpen,
};

// Returns a valid section value, falling back to the default for anything else
export const getValidSection = (value) => {
  return Object.values(INSTITUTION_SECTIONS).includes(value) ? value : DEFAULT_INSTITUTION_SECTION;
};

// Options of the toggle in the saved section
export const SAVED_TYPES = {
  jobs: 'jobs',
  events: 'events',
};

// Value of the "All Resources" chip in the resources section
export const ALL_RESOURCE_CATEGORIES = 'all';

// Most resources loaded for the profile in one request (the API allows up to 100)
export const SOCIETY_RESOURCES_LIMIT = 100;

// Value of the "All" chip in the members section
export const ALL_MEMBER_STAGES = 'all';

// Study stages shown as chips, in order. Each maps to education_level values;
// a graduated student is shown as a graduate whatever their level says.
// dot    - colour of the marker on the filter chip
// badge  - colour of the stage badge in the table
export const MEMBER_STAGES = [
  {
    value: 'school',
    label: 'School leaver',
    educationLevels: ['gcse', 'a_level', 'btec'],
    dot: 'bg-amber-500',
    badge: 'bg-amber-500/10 text-amber-500 ring-amber-500/20',
  },
  {
    value: 'undergraduate',
    label: 'Undergraduate',
    educationLevels: ['undergraduate'],
    dot: 'bg-sky-500',
    badge: 'bg-sky-500/10 text-sky-500 ring-sky-500/20',
  },
  {
    value: 'postgraduate',
    label: 'Postgraduate',
    educationLevels: ['postgraduate', 'phd'],
    dot: 'bg-violet-500',
    badge: 'bg-violet-500/10 text-violet-500 ring-violet-500/20',
  },
  {
    value: 'graduate',
    label: 'Graduate',
    educationLevels: [],
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20',
  },
];

export const getMemberStageOption = (member) => {
  return MEMBER_STAGES.find(stage => stage.value === getMemberStage(member));
};

// Which chip a member belongs under
export const getMemberStage = (member) => {
  if (member.uni_year === 'graduated') return 'graduate';

  const stage = MEMBER_STAGES.find(option => option.educationLevels.includes(member.education_level));
  return stage ? stage.value : null;
};

export const getMemberName = (member) => {
  return `${member.first_name || ''} ${member.last_name || ''}`.trim();
};

export const getMemberInitials = (member) => {
  return `${member.first_name?.[0] || ''}${member.last_name?.[0] || ''}`.toUpperCase() || '?';
};

// "Sep 2024"
export const formatMemberSince = (date) => {
  return date ? new Date(date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '';
};
