// Settings and helpers shared by the jobseeker and institution profiles.

// Cards shown per page. Event cards carry an image and are roughly twice the
// height of the others, so fewer fit comfortably on a page.
export const PROFILE_ITEMS_PER_PAGE = 6;
export const PROFILE_EVENTS_PER_PAGE = 3;

// Returns a valid section value for a profile, falling back to its default
export const getValidSection = (sections, value, fallback) => {
  return Object.values(sections).includes(value) ? value : fallback;
};

export const formatEventDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatEventTime = (event) => {
  return `${event.event_start_time?.slice(0, 5)} - ${event.event_end_time?.slice(0, 5)}`;
};
