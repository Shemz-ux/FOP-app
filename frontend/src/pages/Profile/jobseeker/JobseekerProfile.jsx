import { useCallback, useState } from 'react';
import { Bookmark, Calendar, CalendarCheck, Search, Send } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import EducationCard from '../../../components/Ui/EducationCard';
import CVUploadCard from '../../../components/Ui/CVUploadCard';
import { useAuth } from '../../../contexts/AuthContext';
import { dashboardService, profileService } from '../../../services';
import { addJobTagsToList, addEventTagsToList } from '../../../utils/tagGenerator';
import ProfileHeader from '../components/ProfileHeader';
import SectionTabs from '../components/SectionTabs';
import TogglePanel from '../components/TogglePanel';
import ProfileJobCard from '../components/ProfileJobCard';
import ProfileEventCard from '../components/ProfileEventCard';
import ProfileToast from '../components/ProfileToast';
import { useSavedItems } from '../utils/useSavedItems';
import { useLoadOnVisible } from '../utils/useLoadOnVisible';
import { useToast } from '../utils/useToast';
import {
  PROFILE_EVENTS_PER_PAGE,
  countThisMonth,
  formatEventDay,
  getInitials,
  getNextEvent,
  getValidSection,
} from '../utils/profileOptions';
import { jobseekerProfileCopy as copy } from './jobseekerProfile.copy';
import { profileSharedCopy as sharedCopy } from '../profile.copy';
import {
  DEFAULT_JOBSEEKER_SECTION,
  EMPTY_CV_DATA,
  JOBSEEKER_SECTIONS,
  JOBSEEKER_SECTION_ICONS,
  LIST_TYPES,
  cleanEducationData,
  getEducationSummary,
  toCvData,
  toEducationData,
} from './jobseekerOptions';

export default function JobseekerProfile() {
  const { user } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const saved = useSavedItems(showToast);
  const { savedJobs, savedEvents, savedJobIds, savedEventIds, toggleSavedJob, toggleSavedEvent } = saved;
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobseeker, setJobseeker] = useState(null);
  const [educationData, setEducationData] = useState(null);
  const [uploadedCV, setUploadedCV] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Updates the header and education card. The CV card is only set on load,
  // because it keeps its own state after an upload or delete.
  const applyJobseeker = (record) => {
    setJobseeker(record);
    setEducationData(toEducationData(record));
  };

  const loadJobseekerData = useCallback(async () => {
    if (!user) return;

    try {
      const [profile, applied, registered] = await Promise.all([
        profileService.getUserProfile(user.userId, user.userType),
        dashboardService.getAppliedJobs(user.userId),
        dashboardService.getRegisteredEvents(user.userId, user.userType)
      ]);

      if (profile.jobseeker) {
        applyJobseeker(profile.jobseeker);
        setUploadedCV(current => toCvData(profile.jobseeker) || current);
      }
      setAppliedJobs(addJobTagsToList(applied));
      setRegisteredEvents(addEventTagsToList(registered));
    } catch (error) {
      console.error('Error fetching profile data:', error);
      showToast(copy.errors.loadProfile);
    } finally {
      setLoading(false);
    }
  }, [user, showToast]);

  useLoadOnVisible(loadJobseekerData);

  // Errors are thrown to the education card, which shows its own success and failure messages
  const handleSaveEducation = async (newData) => {
    await profileService.updateUserProfile(user.userId, user.userType, cleanEducationData(newData));

    // Refetch so the page shows what the backend stored
    const updatedProfile = await profileService.getUserProfile(user.userId, user.userType);
    if (updatedProfile.jobseeker) applyJobseeker(updatedProfile.jobseeker);
  };

  const handleCVUpload = async (cvData) => {
    try {
      await profileService.updateUserProfile(user.userId, user.userType, {
        cv_file_name: cvData.cv_file_name,
        cv_file_size: cvData.cv_file_size,
        cv_storage_key: cvData.cv_storage_key,
        cv_storage_url: cvData.cv_storage_url,
        cv_uploaded_at: cvData.cv_uploaded_at
      });
      setUploadedCV(cvData);
    } catch (error) {
      console.error('Error uploading CV:', error);
      showToast(copy.errors.uploadCV);
    }
  };

  const handleCVDelete = async () => {
    try {
      await profileService.updateUserProfile(user.userId, user.userType, EMPTY_CV_DATA);
      setUploadedCV(null);
    } catch (error) {
      console.error('Error deleting CV:', error);
      showToast(copy.errors.deleteCV);
    }
  };

  const activeSection = getValidSection(JOBSEEKER_SECTIONS, searchParams.get('tab'), DEFAULT_JOBSEEKER_SECTION);

  const handleSectionChange = (section) => {
    setSearchParams(section === DEFAULT_JOBSEEKER_SECTION ? {} : { tab: section }, { replace: true });
  };

  const renderJob = (job) => (
    <ProfileJobCard
      key={job.job_id}
      job={job}
      isFavorite={savedJobIds.has(job.job_id)}
      onFavoriteClick={toggleSavedJob}
      compact
    />
  );

  const renderEvent = (event) => (
    <ProfileEventCard
      key={event.event_id}
      event={event}
      isFavorite={savedEventIds.has(event.event_id)}
      onFavoriteClick={toggleSavedEvent}
    />
  );

  const recentApplications = countThisMonth(appliedJobs, 'applied_at');
  const nextSavedEvent = getNextEvent(savedEvents);
  const nextRegisteredEvent = getNextEvent(registeredEvents);

  const stats = [
    {
      icon: Send,
      label: copy.stats.applied,
      value: appliedJobs.length,
      loading,
      note: recentApplications > 0
        ? sharedCopy.header.newThisMonth(recentApplications)
        : sharedCopy.header.noneThisMonth
    },
    {
      icon: Bookmark,
      label: copy.stats.savedJobs,
      value: savedJobs.length,
      loading: saved.loading,
      note: copy.stats.notes.readyToApply
    },
    {
      icon: Calendar,
      label: copy.stats.savedEvents,
      value: savedEvents.length,
      loading: saved.loading,
      note: nextSavedEvent
        ? sharedCopy.header.nextEvent(formatEventDay(nextSavedEvent.event_date))
        : sharedCopy.header.noUpcomingEvents
    },
    {
      icon: CalendarCheck,
      label: copy.stats.registered,
      value: registeredEvents.length,
      loading,
      note: nextRegisteredEvent
        ? sharedCopy.header.nextEvent(formatEventDay(nextRegisteredEvent.event_date))
        : sharedCopy.header.noUpcomingEvents
    }
  ];

  const sections = [
    {
      value: JOBSEEKER_SECTIONS.saved,
      label: copy.sections.saved,
      icon: JOBSEEKER_SECTION_ICONS.saved,
      count: saved.loading ? null : savedJobs.length + savedEvents.length
    },
    {
      value: JOBSEEKER_SECTIONS.applications,
      label: copy.sections.applications,
      icon: JOBSEEKER_SECTION_ICONS.applications,
      count: loading ? null : appliedJobs.length + registeredEvents.length
    }
  ];

  const savedOptions = [
    {
      value: LIST_TYPES.jobs,
      label: copy.saved.jobs,
      items: savedJobs,
      empty: { ...copy.saved.empty.jobs, to: '/jobs' },
      renderItem: renderJob
    },
    {
      value: LIST_TYPES.events,
      label: copy.saved.events,
      items: savedEvents,
      itemsPerPage: PROFILE_EVENTS_PER_PAGE,
      empty: { ...copy.saved.empty.events, to: '/events' },
      renderItem: renderEvent
    }
  ];

  const applicationOptions = [
    {
      value: LIST_TYPES.jobs,
      label: copy.applications.jobs,
      items: appliedJobs,
      empty: { ...copy.applications.empty.jobs, to: '/jobs' },
      renderItem: renderJob
    },
    {
      value: LIST_TYPES.events,
      label: copy.applications.events,
      items: registeredEvents,
      itemsPerPage: PROFILE_EVENTS_PER_PAGE,
      empty: { ...copy.applications.empty.events, to: '/events' },
      renderItem: renderEvent
    }
  ];

  return (
    <div className="min-h-screen">
      <ProfileHeader
        identity={{
          initials: getInitials(user?.name),
          name: user?.name,
          subtitle: jobseeker && getEducationSummary(jobseeker, copy.header.student)
        }}
        heading={copy.header.heading}
        description={copy.header.description}
        highlight={recentApplications > 0 ? {
          text: copy.header.recentApplications(recentApplications),
          to: `/profile?tab=${JOBSEEKER_SECTIONS.applications}`
        } : null}
        action={{ label: copy.header.browseJobs, to: '/jobs', icon: Search }}
        stats={stats}
      />
      <SectionTabs
        sections={sections}
        value={activeSection}
        onChange={handleSectionChange}
        label={copy.sections.label}
      />

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <EducationCard
              educationData={educationData}
              onSave={handleSaveEducation}
            />

            <CVUploadCard
              uploadedCV={uploadedCV}
              onUpload={handleCVUpload}
              onDelete={handleCVDelete}
            />
          </div>

          <div className="lg:col-span-3">
            {activeSection === JOBSEEKER_SECTIONS.saved && (
              <TogglePanel
                title={copy.saved.title}
                toggleLabel={copy.saved.toggleLabel}
                options={savedOptions}
                loading={saved.loading}
              />
            )}
            {activeSection === JOBSEEKER_SECTIONS.applications && (
              <TogglePanel
                title={copy.applications.title}
                toggleLabel={copy.applications.toggleLabel}
                options={applicationOptions}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>

      <ProfileToast toast={toast} onClose={hideToast} />
    </div>
  );
}
