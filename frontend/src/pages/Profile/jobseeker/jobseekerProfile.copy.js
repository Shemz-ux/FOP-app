// Text for the jobseeker profile.
// Text shared with the institution profile comes from ../profile.copy.js.
import { profileSharedCopy } from '../profile.copy';

const jobseekerProfileCopy = {
  header: {
    student: 'Student',
    heading: 'Welcome back to your job search',
    description: 'This is where you keep track of it all — the jobs and events you have saved, the roles you have applied for, and the details employers see.',
    recentApplications: (count) => `${count} ${count === 1 ? 'application' : 'applications'} sent this month`,
    browseJobs: 'Browse jobs'
  },
  stats: {
    ...profileSharedCopy.stats,
    applied: 'Applications',
    registered: 'Events registered',
    notes: {
      readyToApply: 'Ready to apply'
    }
  },
  sections: {
    label: 'Profile sections',
    saved: 'Saved',
    applications: 'Applications'
  },
  saved: {
    title: 'Your saved',
    toggleLabel: 'Saved item type',
    jobs: 'Jobs',
    events: 'Events',
    empty: {
      jobs: {
        message: 'No saved jobs yet.',
        link: 'Browse jobs'
      },
      events: {
        message: 'No saved events yet.',
        link: 'Browse events'
      }
    }
  },
  applications: {
    title: 'Your applications',
    toggleLabel: 'Application type',
    jobs: 'Jobs',
    events: 'Events',
    empty: {
      jobs: {
        message: 'No applications yet.',
        link: 'Find jobs'
      },
      events: {
        message: 'No registered events yet.',
        link: 'Browse events'
      }
    }
  },
  errors: {
    loadProfile: 'Failed to load your profile.',
    uploadCV: 'Failed to save your CV. Please try again.',
    deleteCV: 'Failed to delete your CV. Please try again.'
  }
};

export { jobseekerProfileCopy };
