// Settings and helpers shared by the jobseeker and institution profiles.

// Cards shown per page in each tab
export const PROFILE_ITEMS_PER_PAGE = 6;

// Tab values, also used by the mobile dropdown
export const PROFILE_TABS = {
  savedJobs: 'saved-jobs',
  appliedJobs: 'applied-jobs',
  savedEvents: 'saved-events',
  registeredEvents: 'registered-events',
};

export const formatEventDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatEventTime = (event) => {
  return `${event.event_start_time?.slice(0, 5)} - ${event.event_end_time?.slice(0, 5)}`;
};
