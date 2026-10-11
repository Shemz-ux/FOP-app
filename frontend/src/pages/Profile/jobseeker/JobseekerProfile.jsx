import { useCallback, useState } from 'react';
import { Briefcase, Calendar } from 'lucide-react';
import EducationCard from '../../../components/Ui/EducationCard';
import CVUploadCard from '../../../components/Ui/CVUploadCard';
import { useAuth } from '../../../contexts/AuthContext';
import { dashboardService, profileService } from '../../../services';
import { addJobTagsToList, addEventTagsToList } from '../../../utils/tagGenerator';
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
import { jobseekerProfileCopy as copy } from './jobseekerProfile.copy';
import {
  EMPTY_CV_DATA,
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
  const [activeTab, setActiveTab] = useState(PROFILE_TABS.savedJobs);
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

  const renderJob = (job) => (
    <ProfileJobCard
      key={job.job_id}
      job={job}
      isFavorite={savedJobIds.has(job.job_id)}
      onFavoriteClick={toggleSavedJob}
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

  const stats = [
    { label: copy.stats.applied, value: appliedJobs.length, loading },
    { label: copy.stats.savedJobs, value: savedJobs.length, loading: saved.loading },
    { label: copy.stats.savedEvents, value: savedEvents.length, loading: saved.loading }
  ];

  const tabs = [
    {
      value: PROFILE_TABS.savedJobs,
      label: copy.tabs.savedJobs,
      content: (
        <PaginatedGrid
          items={savedJobs}
          renderItem={renderJob}
          loading={saved.loading}
          empty={{ icon: Briefcase, ...copy.empty.savedJobs }}
        />
      )
    },
    {
      value: PROFILE_TABS.appliedJobs,
      label: copy.tabs.appliedJobs,
      content: (
        <PaginatedGrid
          items={appliedJobs}
          renderItem={renderJob}
          loading={loading}
          empty={{ icon: Briefcase, ...copy.empty.appliedJobs }}
        />
      )
    },
    {
      value: PROFILE_TABS.savedEvents,
      label: copy.tabs.savedEvents,
      content: (
        <PaginatedGrid
          items={savedEvents}
          renderItem={renderEvent}
          loading={saved.loading}
          empty={{ icon: Calendar, ...copy.empty.savedEvents }}
        />
      )
    },
    {
      value: PROFILE_TABS.registeredEvents,
      label: copy.tabs.registeredEvents,
      content: (
        <PaginatedGrid
          items={registeredEvents}
          renderItem={renderEvent}
          loading={loading}
          empty={{ icon: Calendar, ...copy.empty.registeredEvents }}
        />
      )
    }
  ];

  return (
    <div className="min-h-screen">
      <ProfileHeader
        name={user?.name}
        subtitle={jobseeker && getEducationSummary(jobseeker, copy.header.student)}
        stats={stats}
      />

      <div className="container mx-auto px-6 py-12">
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
            <ProfileTabs tabs={tabs} value={activeTab} onChange={setActiveTab} />
          </div>
        </div>
      </div>

      <ProfileToast toast={toast} onClose={hideToast} />
    </div>
  );
}
