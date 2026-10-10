import { useCallback, useState } from 'react';
import { Briefcase, Calendar } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { profileService } from '../../../services';
import ProfileHeader from '../components/ProfileHeader';
import ProfileTabs from '../components/ProfileTabs';
import PaginatedGrid from '../components/PaginatedGrid';
import ProfileJobCard from '../components/ProfileJobCard';
import ProfileEventCard from '../components/ProfileEventCard';
import ProfileToast from '../components/ProfileToast';
import { useSavedItems } from '../utils/useSavedItems';
import { useLoadOnVisible } from '../utils/useLoadOnVisible';
import { useToast } from '../utils/useToast';
import { PROFILE_TABS } from '../utils/profileOptions';
import { useSocietyResources } from './useSocietyResources';
import { institutionProfileCopy as copy } from './institutionProfile.copy';

export default function InstitutionProfile() {
  const { user } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const saved = useSavedItems(showToast);
  const { savedJobs, savedEvents, savedJobIds, savedEventIds, toggleSavedJob, toggleSavedEvent } = saved;
  const societyResources = useSocietyResources(showToast);
  const [activeTab, setActiveTab] = useState(PROFILE_TABS.savedJobs);
  const [subtitle, setSubtitle] = useState('');

  // The subtitle is the society's university. A failed request only costs the subtitle,
  // so it falls back to a generic label instead of showing an error.
  const loadSociety = useCallback(async () => {
    if (!user) return;

    try {
      const profile = await profileService.getUserProfile(user.userId, user.userType);
      setSubtitle(profile.society?.university || copy.header.subtitleFallback);
    } catch (error) {
      console.error('Error fetching society profile:', error);
      setSubtitle(current => current || copy.header.subtitleFallback);
    }
  }, [user]);

  useLoadOnVisible(loadSociety);

  const stats = [
    { label: copy.stats.savedJobs, value: savedJobs.length, loading: saved.loading },
    { label: copy.stats.savedEvents, value: savedEvents.length, loading: saved.loading },
    { label: copy.stats.resources, value: societyResources.total, loading: societyResources.total === null }
  ];

  const tabs = [
    {
      value: PROFILE_TABS.savedJobs,
      label: copy.tabs.savedJobs,
      content: (
        <PaginatedGrid
          items={savedJobs}
          loading={saved.loading}
          empty={{ icon: Briefcase, ...copy.empty.savedJobs }}
          renderItem={(job) => (
            <ProfileJobCard
              key={job.job_id}
              job={job}
              isFavorite={savedJobIds.has(job.job_id)}
              onFavoriteClick={toggleSavedJob}
            />
          )}
        />
      )
    },
    {
      value: PROFILE_TABS.savedEvents,
      label: copy.tabs.savedEvents,
      content: (
        <PaginatedGrid
          items={savedEvents}
          loading={saved.loading}
          empty={{ icon: Calendar, ...copy.empty.savedEvents }}
          renderItem={(event) => (
            <ProfileEventCard
              key={event.event_id}
              event={event}
              isFavorite={savedEventIds.has(event.event_id)}
              onFavoriteClick={toggleSavedEvent}
            />
          )}
        />
      )
    }
  ];

  return (
    <div className="min-h-screen">
      <ProfileHeader name={user?.name} subtitle={subtitle} stats={stats} />

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-4">
            <ProfileTabs tabs={tabs} value={activeTab} onChange={setActiveTab} />
          </div>
        </div>
      </div>

      <ProfileToast toast={toast} onClose={hideToast} />
    </div>
  );
}
