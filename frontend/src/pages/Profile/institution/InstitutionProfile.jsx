import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { profileService } from '../../../services';
import ProfileHeader from '../components/ProfileHeader';
import ProfileToast from '../components/ProfileToast';
import ProfileJobCard from '../components/ProfileJobCard';
import ProfileEventCard from '../components/ProfileEventCard';
import { useSavedItems } from '../utils/useSavedItems';
import { useLoadOnVisible } from '../utils/useLoadOnVisible';
import { useToast } from '../utils/useToast';
import { PROFILE_EVENTS_PER_PAGE, getValidSection } from '../utils/profileOptions';
import SectionTabs from '../components/SectionTabs';
import TogglePanel from '../components/TogglePanel';
import ResourcesPanel from './components/ResourcesPanel';
import MembersPanel from './components/MembersPanel';
import { useSocietyResources } from './useSocietyResources';
import { useSocietyMembers } from './useSocietyMembers';
import { institutionProfileCopy as copy } from './institutionProfile.copy';
import { DEFAULT_INSTITUTION_SECTION, INSTITUTION_SECTIONS, INSTITUTION_SECTION_ICONS, SAVED_TYPES } from './institutionOptions';

export default function InstitutionProfile() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast, showToast, hideToast } = useToast();
  const saved = useSavedItems(showToast);
  const societyResources = useSocietyResources(showToast);
  const societyMembers = useSocietyMembers(showToast);
  const [subtitle, setSubtitle] = useState('');

  const activeSection = getValidSection(INSTITUTION_SECTIONS, searchParams.get('tab'), DEFAULT_INSTITUTION_SECTION);

  // The subtitle names the society's university. A failed request only costs the subtitle,
  // so it falls back to a generic label instead of showing an error.
  const loadSociety = useCallback(async () => {
    if (!user) return;

    try {
      const profile = await profileService.getUserProfile(user.userId, user.userType);
      const university = profile.society?.university;
      setSubtitle(university ? copy.header.subtitle(university) : copy.header.accountType);
    } catch (error) {
      console.error('Error fetching society profile:', error);
      setSubtitle(current => current || copy.header.accountType);
    }
  }, [user]);

  useLoadOnVisible(loadSociety);

  const handleSectionChange = (section) => {
    setSearchParams(section === DEFAULT_INSTITUTION_SECTION ? {} : { tab: section }, { replace: true });
  };

  const stats = [
    { label: copy.stats.members, value: societyMembers.total, loading: societyMembers.total === null },
    { label: copy.stats.savedJobs, value: saved.savedJobs.length, loading: saved.loading },
    { label: copy.stats.savedEvents, value: saved.savedEvents.length, loading: saved.loading },
    { label: copy.stats.resources, value: societyResources.total, loading: societyResources.total === null }
  ];

  const sections = [
    {
      value: INSTITUTION_SECTIONS.members,
      label: copy.sections.members,
      icon: INSTITUTION_SECTION_ICONS.members,
      count: societyMembers.total
    },
    {
      value: INSTITUTION_SECTIONS.saved,
      label: copy.sections.saved,
      icon: INSTITUTION_SECTION_ICONS.saved,
      count: saved.loading ? null : saved.savedJobs.length + saved.savedEvents.length
    },
    {
      value: INSTITUTION_SECTIONS.resources,
      label: copy.sections.resources,
      icon: INSTITUTION_SECTION_ICONS.resources,
      count: societyResources.total
    }
  ];

  // The two lists behind the Saved section's toggle
  const savedOptions = [
    {
      value: SAVED_TYPES.jobs,
      label: copy.saved.jobs,
      items: saved.savedJobs,
      empty: { ...copy.saved.empty.jobs, to: '/jobs' },
      renderItem: (job) => (
        <ProfileJobCard
          key={job.job_id}
          job={job}
          isFavorite={saved.savedJobIds.has(job.job_id)}
          onFavoriteClick={saved.toggleSavedJob}
          compact
        />
      )
    },
    {
      value: SAVED_TYPES.events,
      label: copy.saved.events,
      items: saved.savedEvents,
      itemsPerPage: PROFILE_EVENTS_PER_PAGE,
      empty: { ...copy.saved.empty.events, to: '/events' },
      renderItem: (event) => (
        <ProfileEventCard
          key={event.event_id}
          event={event}
          isFavorite={saved.savedEventIds.has(event.event_id)}
          onFavoriteClick={saved.toggleSavedEvent}
        />
      )
    }
  ];

  return (
    <div className="min-h-screen">
      <ProfileHeader name={user?.name} subtitle={subtitle} stats={stats} />
      <SectionTabs sections={sections} value={activeSection} onChange={handleSectionChange} label={copy.sections.label} />

      <div className="container mx-auto px-6 py-8">
        {activeSection === INSTITUTION_SECTIONS.members && <MembersPanel societyMembers={societyMembers} />}
        {activeSection === INSTITUTION_SECTIONS.saved && (
          <TogglePanel
            title={copy.saved.title}
            toggleLabel={copy.saved.toggleLabel}
            options={savedOptions}
            loading={saved.loading}
          />
        )}
        {activeSection === INSTITUTION_SECTIONS.resources && (
          <ResourcesPanel societyResources={societyResources} onError={showToast} />
        )}
      </div>

      <ProfileToast toast={toast} onClose={hideToast} />
    </div>
  );
}
