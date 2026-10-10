// Settings for the institution (society) profile.
import { Bookmark, BookOpen } from 'lucide-react';

// Sections of the profile, in the order of the tab bar. The active one is kept in the URL (?tab=)
export const INSTITUTION_SECTIONS = {
  saved: 'saved',
  resources: 'resources',
};

export const DEFAULT_INSTITUTION_SECTION = INSTITUTION_SECTIONS.saved;

export const INSTITUTION_SECTION_ICONS = {
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
