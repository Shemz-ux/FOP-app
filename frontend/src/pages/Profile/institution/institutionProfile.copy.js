// Text for the institution (society) profile.
// Text shared with the jobseeker profile comes from ../profile.copy.js.
import { profileSharedCopy } from '../profile.copy';

const institutionProfileCopy = {
  header: {
    subtitleFallback: 'Society'
  },
  stats: {
    ...profileSharedCopy.stats,
    resources: 'Resources'
  },
  tabs: profileSharedCopy.tabs,
  empty: profileSharedCopy.empty,
  errors: {
    loadResources: 'Failed to load resources.'
  }
};

export { institutionProfileCopy };
