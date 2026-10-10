// Text for the institution (society) profile.
// Text shared with the jobseeker profile comes from ../profile.copy.js.
import { profileSharedCopy } from '../profile.copy';

const institutionProfileCopy = {
  header: {
    accountType: 'Society',
    subtitle: (university) => `Society • ${university}`
  },
  stats: {
    ...profileSharedCopy.stats,
    resources: 'Resources available'
  },
  sections: {
    label: 'Profile sections',
    saved: 'Saved',
    resources: 'Resources'
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
  resources: {
    title: 'Resources for your students',
    description: 'Workshop materials and job-search guides to download and use with your members',
    available: (count) => `${count} ${count === 1 ? 'resource' : 'resources'} available`,
    filterLabel: 'Filter resources by category',
    allCategories: 'All Resources',
    downloadError: 'Failed to download resource. Please try again.',
    empty: {
      title: 'No resources yet',
      message: 'Resources shared with societies will appear here.'
    },
    card: {
      video: 'Video',
      download: 'Download',
      downloading: 'Preparing...',
      watch: 'Watch',
      downloads: (count, isVideo) => `${count} ${isVideo ? (count === 1 ? 'view' : 'views') : (count === 1 ? 'download' : 'downloads')}`,
      viewDetails: (title) => `View details for ${title}`,
      viewDetailsShort: 'View details'
    }
  },
  errors: {
    loadResources: 'Failed to load resources.'
  }
};

export { institutionProfileCopy };
