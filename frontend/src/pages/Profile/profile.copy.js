// Text shared by the jobseeker and institution profiles.
// Each profile's own text is in its folder.

const profileSharedCopy = {
  header: {
    nameFallback: 'User',
    settings: 'Account settings',
    statLoading: '–',
    greeting: {
      morning: 'Good morning',
      afternoon: 'Good afternoon',
      evening: 'Good evening'
    },
    snapshot: 'Your snapshot',
    term: {
      autumn: (year) => `Autumn term ${year}`,
      spring: (year) => `Spring term ${year}`,
      summer: (year) => `Summer term ${year}`
    },
    nextEvent: (day) => `Next: ${day}`,
    noUpcomingEvents: 'None coming up',
    newThisMonth: (count) => `+${count} this month`,
    noneThisMonth: 'None this month'
  },
  stats: {
    savedJobs: 'Saved Jobs',
    savedEvents: 'Saved Events'
  },
  tabs: {
    placeholder: 'Select tab',
    savedJobs: 'Saved Jobs',
    savedEvents: 'Saved Events'
  },
  empty: {
    savedJobs: {
      title: 'No saved jobs yet',
      message: 'Jobs you save will appear here.'
    },
    savedEvents: {
      title: 'No saved events yet',
      message: 'Events you save will appear here.'
    }
  },
  errors: {
    loadSaved: 'Failed to load your saved jobs and events.',
    saveJob: 'Failed to save job. Please try again.',
    unsaveJob: 'Failed to unsave job. Please try again.',
    saveEvent: 'Failed to save event. Please try again.',
    unsaveEvent: 'Failed to unsave event. Please try again.'
  }
};

export { profileSharedCopy };
