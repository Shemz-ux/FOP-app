// Text for the institution (society) profile.
// Text shared with the jobseeker profile comes from ../profile.copy.js.
import { profileSharedCopy } from '../profile.copy';

const institutionProfileCopy = {
  header: {
    accountType: 'Society',
    heading: 'Welcome back to your society hub',
    description: "This is where you support your members' careers — see who's on your plan, share the jobs and events you've saved, and download ready-to-run workshop materials.",
    newMembers: (count) => `${count} new ${count === 1 ? 'member' : 'members'} joined this month`,
    exploreResources: 'Explore resources'
  },
  stats: {
    ...profileSharedCopy.stats,
    members: 'Members',
    resources: 'Resources',
    notes: {
      readyToShare: 'Ready to share',
      forYourMembers: 'To use with your members'
    }
  },
  sections: {
    label: 'Profile sections',
    members: 'Members',
    saved: 'Saved',
    resources: 'Resources'
  },
  members: {
    title: 'Your members',
    description: "Students on your society plan and how they're engaging",
    count: (count) => `${count} ${count === 1 ? 'member' : 'members'}`,
    filterLabel: 'Filter members by stage',
    allStages: 'All',
    searchLabel: 'Search members',
    searchPlaceholder: 'Search name or course',
    columns: {
      student: 'Student',
      course: 'Course',
      stage: 'Stage',
      year: 'Year of study',
      applications: 'Applications',
      since: 'Member since',
      expand: 'Show details'
    },
    detail: {
      toggle: (name) => `Show details for ${name}`,
      email: 'Email',
      jobsApplied: 'Jobs applied',
      jobsAppliedvalue: (count) => `${count} applied`,
      eventsRegistered: 'Events registered',
      eventsRegisteredValue: (count) => `${count} registered`,
      interests: 'Interests'
    },
    notGiven: '—',
    empty: {
      title: 'No members yet',
      message: 'Students who choose your society when they sign up will appear here.'
    },
    noMatches: {
      title: 'No members match',
      message: 'Try a different stage, year or search.'
    }
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
    loadMembers: 'Failed to load your members.',
    loadResources: 'Failed to load resources.'
  }
};

export { institutionProfileCopy };
