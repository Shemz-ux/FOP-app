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

// ==================== HEADER ====================

// Up to two initials for an avatar, from a display name
export const getInitials = (name) => {
  if (!name) return '?';

  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join('') || '?';
};

// Greeting by local time of day. Keys match profileSharedCopy.header.greeting.
export const getGreetingKey = (date = new Date()) => {
  const hour = date.getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
};

// Academic term the date falls in, e.g. { key: 'autumn', year: 2026 }
export const getTerm = (date = new Date()) => {
  const month = date.getMonth();
  if (month >= 8) return { key: 'autumn', year: date.getFullYear() };
  if (month >= 4) return { key: 'summer', year: date.getFullYear() };
  return { key: 'spring', year: date.getFullYear() };
};

// How many records carry a date in the current calendar month
export const countThisMonth = (items, dateField) => {
  const now = new Date();

  return items.filter(item => {
    const value = item?.[dateField];
    if (!value) return false;

    const date = new Date(value);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;
};

// The soonest event still to come, or null when they are all in the past
export const getNextEvent = (events) => {
  const now = new Date();

  return events
    .filter(event => event.event_date && new Date(event.event_date) >= now)
    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))[0] || null;
};

// "15 January"
export const formatEventDay = (date) => {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
};
