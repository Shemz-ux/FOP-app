// Text for the jobseeker profile.
// Text shared with the institution profile comes from ../profile.copy.js.
import { profileSharedCopy } from '../profile.copy';

const jobseekerProfileCopy = {
  header: {
    student: 'Student'
  },
  stats: {
    ...profileSharedCopy.stats,
    applied: 'Applied'
  },
  tabs: {
    ...profileSharedCopy.tabs,
    appliedJobs: 'Applied Jobs',
    registeredEvents: 'Registered Events'
  },
  empty: {
    ...profileSharedCopy.empty,
    appliedJobs: {
      title: 'No applications yet',
      message: 'Jobs you apply for will appear here.'
    },
    registeredEvents: {
      title: 'No registered events yet',
      message: 'Events you register for will appear here.'
    }
  },
  errors: {
    loadProfile: 'Failed to load your profile.',
    uploadCV: 'Failed to save your CV. Please try again.',
    deleteCV: 'Failed to delete your CV. Please try again.'
  }
};

export { jobseekerProfileCopy };
