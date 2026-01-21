import { useState, useEffect } from "react";
import { Briefcase, Calendar, Heart, User, Settings, Bell, ChevronDown } from "lucide-react";
import JobCard from "../../components/JobCard/JobCard";
import EventCard from "../../components/EventCard/EventCard";
import LoadingSpinner from "../../components/Ui/LoadingSpinner";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/Ui/Avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/Tabs";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination/Pagination";
import EducationCard from "../../components/ui/EducationCard";
import CVUploadCard from "../../components/ui/CVUploadCard";
import CustomSelect from "../../components/Ui/CustomSelect";
import { useAuth } from '../../contexts/AuthContext';
import { dashboardService } from '../../services';
import { profileService } from '../../services';
import * as jobActionsService from '../../services/Jobs/jobActions';
import * as eventActionsService from '../../services/Events/eventActions';
import { addJobTagsToList, addEventTagsToList } from '../../utils/tagGenerator';

export default function Profile() {
  const { user, isJobseeker, isSociety, isAdmin } = useAuth();
  const [favorites, setFavorites] = useState(new Set([0, 1]));
  const [eventFavorites, setEventFavorites] = useState(new Set([0]));
  const [activeTab, setActiveTab] = useState("saved-jobs");
  const [loading, setLoading] = useState(true);
  const [savedJobsData, setSavedJobsData] = useState([]);
  const [appliedJobsData, setAppliedJobsData] = useState([]);
  const [savedEventsData, setSavedEventsData] = useState([]);
  const [registeredEventsData, setRegisteredEventsData] = useState([]);
  const [profileData, setProfileData] = useState(null);
  
  // Pagination state for each tab
  const [savedJobsPage, setSavedJobsPage] = useState(1);
  const [appliedJobsPage, setAppliedJobsPage] = useState(1);
  const [savedEventsPage, setSavedEventsPage] = useState(1);
  const [registeredEventsPage, setRegisteredEventsPage] = useState(1);
  const itemsPerPage = 6;
  
  const [educationData, setEducationData] = useState(null);
  const [uploadedCV, setUploadedCV] = useState(null);

  const toggleFavorite = async (jobId) => {
    if (!user) return;
    
    try {
      const isSaved = favorites.has(jobId);
      console.log('Toggle favorite:', { jobId, isSaved, userId: user.userId, userType: user.userType });
      
      if (isSaved) {
        console.log('Unsaving job...');
        const result = await jobActionsService.unsaveJob(jobId, user.userId, user.userType);
        console.log('Unsave result:', result);
        
        setFavorites((prev) => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          console.log('Updated favorites:', newSet);
          return newSet;
        });
        
        // Remove from savedJobsData
        setSavedJobsData(prev => {
          const filtered = prev.filter(job => job.job_id !== jobId);
          console.log('Updated savedJobsData:', filtered.length);
          return filtered;
        });
      } else {
        console.log('Saving job...');
        const result = await jobActionsService.saveJob(jobId, user.userId, user.userType);
        console.log('Save result:', result);
        setFavorites((prev) => new Set(prev).add(jobId));
      }
    } catch (err) {
      console.error('Error toggling job save:', err);
      alert(`Failed to ${favorites.has(jobId) ? 'unsave' : 'save'} job. Please try again.`);
    }
  };

  const toggleEventFavorite = async (eventId) => {
    if (!user) return;
    
    try {
      const isSaved = eventFavorites.has(eventId);
      
      if (isSaved) {
        await eventActionsService.unsaveEvent(eventId, user.userId, user.userType);
        setEventFavorites((prev) => {
          const newSet = new Set(prev);
          newSet.delete(eventId);
          return newSet;
        });
        // Remove from savedEventsData
        setSavedEventsData(prev => prev.filter(event => event.event_id !== eventId));
      } else {
        await eventActionsService.saveEvent(eventId, user.userId, user.userType);
        setEventFavorites((prev) => new Set(prev).add(eventId));
      }
    } catch (err) {
      console.error('Error toggling event save:', err);
      alert('Failed to save event. Please try again.');
    }
  };

  const handleSaveEducation = async (newData) => {
    try {
      // Clean up data based on education level (similar to signup form logic)
      const cleanedData = { ...newData };
      
      if (cleanedData.education_level === 'gcse') {
        // GCSE students don't need university fields or subjects
        cleanedData.uni_year = null;
        cleanedData.degree_type = null;
        cleanedData.area_of_study = null;
        // Keep subject fields as they might be filled
      } else if (['a_level', 'btec'].includes(cleanedData.education_level)) {
        // A-Level/BTEC students don't need university-specific fields
        cleanedData.uni_year = null;
        cleanedData.degree_type = null;
        cleanedData.area_of_study = null;
        // Keep subject fields
      } else if (['undergraduate', 'postgraduate', 'phd'].includes(cleanedData.education_level)) {
        // University students don't need subject fields
        cleanedData.subject_one = null;
        cleanedData.subject_two = null;
        cleanedData.subject_three = null;
        cleanedData.subject_four = null;
      }
      
      // Convert empty strings to null for optional fields
      Object.keys(cleanedData).forEach(key => {
        if (cleanedData[key] === '') {
          cleanedData[key] = null;
        }
      });
      
      await profileService.updateUserProfile(user.userId, user.userType, cleanedData);
      
      // Refetch profile data to ensure we have the latest from backend
      const updatedProfile = await profileService.getUserProfile(user.userId, user.userType);
      setProfileData(updatedProfile);
      
      // Update education data with fresh data from backend
      if (updatedProfile.jobseeker) {
        setEducationData({
          education_level: updatedProfile.jobseeker.education_level ?? "",
          institution_name: updatedProfile.jobseeker.institution_name ?? "",
          uni_year: updatedProfile.jobseeker.uni_year ?? "",
          degree_type: updatedProfile.jobseeker.degree_type ?? "",
          area_of_study: updatedProfile.jobseeker.area_of_study ?? "",
          subject_one: updatedProfile.jobseeker.subject_one ?? "",
          subject_two: updatedProfile.jobseeker.subject_two ?? "",
          subject_three: updatedProfile.jobseeker.subject_three ?? "",
          subject_four: updatedProfile.jobseeker.subject_four ?? "",
          role_interest_option_one: updatedProfile.jobseeker.role_interest_option_one ?? "",
          role_interest_option_two: updatedProfile.jobseeker.role_interest_option_two ?? "",
          society: updatedProfile.jobseeker.society ?? ""
        });
      }
      
      console.log('Education details saved successfully');
    } catch (error) {
      console.error('Error saving education:', error);
      console.error('Failed to save education details');
    }
  };

  const handleCVUpload = async (cvData) => {
    try {
      // Update jobseeker profile with CV metadata
      await profileService.updateUserProfile(user.userId, user.userType, {
        cv_file_name: cvData.cv_file_name,
        cv_file_size: cvData.cv_file_size,
        cv_storage_key: cvData.cv_storage_key,
        cv_storage_url: cvData.cv_storage_url,
        cv_uploaded_at: cvData.cv_uploaded_at
      });
      
      // Update local state
      setUploadedCV(cvData);
      console.log('CV uploaded successfully');
    } catch (error) {
      console.error('Error uploading CV:', error);
      console.error('Failed to upload CV');
    }
  };

  const handleCVDelete = async () => {
    try {
      // Update jobseeker profile to remove CV metadata
      await profileService.updateUserProfile(user.userId, user.userType, {
        cv_file_name: null,
        cv_file_size: null,
        cv_storage_key: null,
        cv_storage_url: null,
        cv_uploaded_at: null
      });
      
      // Clear local state
      setUploadedCV(null);
    } catch (error) {
      console.error('Error deleting CV:', error);
      console.error('Failed to delete CV');
    }
  };

  // Fetch profile and dashboard data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Fetch profile data
        const profile = await profileService.getUserProfile(user.userId, user.userType);
        setProfileData(profile);
        
        // Set education data for jobseekers
        if (isJobseeker() && profile.jobseeker) {
          setEducationData({
            education_level: profile.jobseeker.education_level ?? "",
            institution_name: profile.jobseeker.institution_name ?? "",
            uni_year: profile.jobseeker.uni_year ?? "",
            degree_type: profile.jobseeker.degree_type ?? "",
            area_of_study: profile.jobseeker.area_of_study ?? "",
            subject_one: profile.jobseeker.subject_one ?? "",
            subject_two: profile.jobseeker.subject_two ?? "",
            subject_three: profile.jobseeker.subject_three ?? "",
            subject_four: profile.jobseeker.subject_four ?? "",
            role_interest_option_one: profile.jobseeker.role_interest_option_one ?? "",
            role_interest_option_two: profile.jobseeker.role_interest_option_two ?? "",
            society: profile.jobseeker.society ?? ""
          });
          
          // Set CV data if exists
          if (profile.jobseeker.cv_file_name) {
            setUploadedCV({
              cv_file_name: profile.jobseeker.cv_file_name,
              cv_file_size: profile.jobseeker.cv_file_size,
              cv_storage_key: profile.jobseeker.cv_storage_key,
              cv_storage_url: profile.jobseeker.cv_storage_url,
              cv_uploaded_at: profile.jobseeker.cv_uploaded_at
            });
          }
        }
        
        // Fetch dashboard data
        const [savedJobs, appliedJobs, savedEvents, registeredEvents] = await Promise.all([
          dashboardService.getSavedJobs(user.userId, user.userType),
          isJobseeker() ? dashboardService.getAppliedJobs(user.userId) : Promise.resolve([]),
          dashboardService.getSavedEvents(user.userId, user.userType),
          dashboardService.getRegisteredEvents(user.userId, user.userType)
        ]);
        
        // Add tags to jobs and events
        const savedJobsWithTags = addJobTagsToList(savedJobs);
        const appliedJobsWithTags = addJobTagsToList(appliedJobs);
        const savedEventsWithTags = addEventTagsToList(savedEvents);
        const registeredEventsWithTags = addEventTagsToList(registeredEvents);
        
        setSavedJobsData(savedJobsWithTags);
        setAppliedJobsData(appliedJobsWithTags);
        setSavedEventsData(savedEventsWithTags);
        setRegisteredEventsData(registeredEventsWithTags);
        
        // Create Sets of saved IDs for quick lookup
        const savedJobIds = new Set(savedJobsWithTags.map(job => job.job_id));
        const savedEventIds = new Set(savedEventsWithTags.map(event => event.event_id));
        setFavorites(savedJobIds);
        setEventFavorites(savedEventIds);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, isJobseeker]);

  // Pagination helpers
  const getPaginatedItems = (items, currentPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  const getTotalPages = (items) => Math.ceil(items.length / itemsPerPage);

  // Paginated data
  const paginatedSavedJobs = getPaginatedItems(savedJobsData, savedJobsPage);
  const paginatedAppliedJobs = getPaginatedItems(appliedJobsData, appliedJobsPage);
  const paginatedSavedEvents = getPaginatedItems(savedEventsData, savedEventsPage);
  const paginatedRegisteredEvents = getPaginatedItems(registeredEventsData, registeredEventsPage);

  return (
    <div className="min-h-screen">
      {/* Profile Header */}
      <section className="bg-gradient-to-br from-primary/20 via-primary/5 to-background border-b border-border">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="w-30 h-30">
              <AvatarFallback className="text-3xl">
                {user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-left">
              <h1 className="text-3xl mb-2 text-foreground">
                {user?.name || 'User'}
              </h1>
              <p className="text-muted-foreground mb-4">
                {isJobseeker() && profileData?.jobseeker ? 
                  (() => {
                    const educationLevel = profileData.jobseeker.education_level;
                    const educationDisplay = educationLevel === 'gcse' ? 'GCSE' : 
                                            educationLevel === 'a_level' ? 'A-Level' :
                                            educationLevel === 'btec' ? 'BTEC' :
                                            educationLevel === 'phd' ? 'PhD' :
                                            educationLevel ? educationLevel.charAt(0).toUpperCase() + educationLevel.slice(1) : 'Student';
                    const institution = profileData.jobseeker.institution_name || educationDisplay;
                    return educationLevel === 'gcse' ? 
                      `${educationDisplay} Student • ${institution}` :
                      `${educationDisplay} • ${institution}`;
                  })() :
                  isSociety() && profileData?.society ?
                  `${profileData.society.society_name || 'Society'}` :
                  isAdmin() ?
                  'Administrator' :
                  'User'
                }
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/settings"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Account Settings
                </Link>

                {/* <button className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-secondary transition-colors flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Preferences
                </button> */}
              </div>
            </div>

            <div className={`grid ${isSociety() ? 'grid-cols-2' : 'grid-cols-3'} gap-8 text-center`}>
              {isJobseeker() && (
                <div>
                  <div className="text-2xl mb-1 text-foreground">
                    {appliedJobsData.length}
                  </div>
                  <div className="text-muted-foreground text-sm">Applied</div>
                </div>
              )}
              <div>
                <div className="text-2xl mb-1 text-foreground">
                  {savedJobsData.length}
                </div>
                <div className="text-muted-foreground text-sm">Saved Jobs</div>
              </div>
              <div>
                <div className="text-2xl mb-1 text-foreground">
                  {savedEventsData.length}
                </div>
                <div className="text-muted-foreground text-sm">{isSociety() ? 'Saved Events' : 'Saved Events'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* LEFT COLUMN */}
          {isJobseeker() && (
            <div className="lg:col-span-1 space-y-6">
              {/* Education Card - Only for Jobseekers */}
              <EducationCard
                educationData={educationData}
                onSave={handleSaveEducation}
              />

              {/* CV Upload Card - Only for Jobseekers */}
              <CVUploadCard
                uploadedCV={uploadedCV}
                onUpload={handleCVUpload}
                onDelete={handleCVDelete}
              />
            </div>
          )}

          {/* RIGHT COLUMN */}
          <div className={isJobseeker() ? "lg:col-span-3" : "lg:col-span-4"}>
            {/* Mobile Dropdown */}
            <div className="md:hidden mb-6">
              <CustomSelect
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                options={[
                  { value: "saved-jobs", label: "Saved Jobs" },
                  ...(isJobseeker() ? [{ value: "applied-jobs", label: "Applied Jobs" }] : []),
                  { value: "saved-events", label: "Saved Events" },
                  ...(isJobseeker() ? [{ value: "registered-events", label: "Registered Events" }] : [])
                ]}
                placeholder="Select tab"
              />
            </div>

            {/* Desktop Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className={`hidden md:grid ${isSociety() ? 'grid-cols-2' : 'grid-cols-4'} mb-8 w-full`}>
                <TabsTrigger value="saved-jobs">Saved Jobs</TabsTrigger>
                {isJobseeker() && <TabsTrigger value="applied-jobs">Applied Jobs</TabsTrigger>}
                <TabsTrigger value="saved-events">Saved Events</TabsTrigger>
                {isJobseeker() && <TabsTrigger value="registered-events">Registered Events</TabsTrigger>}
              </TabsList>

              <TabsContent value="saved-jobs">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedSavedJobs.map((job) => (
                    <JobCard
                      key={job.job_id}
                      jobId={job.job_id}
                      jobTitle={job.title}
                      company={job.company}
                      companyLogo={job.company_logo}
                      companyColor={job.company_color}
                      description={job.description}
                      postedTime={job.job_created_at || job.created_at}
                      tags={job.tags || []}
                      isFavorite={true}
                      onFavoriteClick={() => toggleFavorite(job.job_id)}
                    />
                  ))}
                </div>
                {savedJobsData.length > itemsPerPage && (
                  <Pagination
                    currentPage={savedJobsPage}
                    totalPages={getTotalPages(savedJobsData)}
                    onPageChange={setSavedJobsPage}
                  />
                )}
              </TabsContent>

              <TabsContent value="applied-jobs">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedAppliedJobs.map((job) => (
                    <JobCard
                      key={job.job_id}
                      jobId={job.job_id}
                      jobTitle={job.title}
                      company={job.company}
                      companyLogo={job.company_logo}
                      companyColor={job.company_color}
                      description={job.description}
                      postedTime={job.job_created_at || job.created_at}
                      tags={job.tags || []}
                      isFavorite={favorites.has(job.job_id)}
                      onFavoriteClick={() => toggleFavorite(job.job_id)}
                    />
                  ))}
                </div>
                {appliedJobsData.length > itemsPerPage && (
                  <Pagination
                    currentPage={appliedJobsPage}
                    totalPages={getTotalPages(appliedJobsData)}
                    onPageChange={setAppliedJobsPage}
                  />
                )}
              </TabsContent>

              <TabsContent value="saved-events">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedSavedEvents.map((event) => (
                    <EventCard
                      key={event.event_id}
                      eventId={event.event_id}
                      title={event.title}
                      organiser={event.organiser}
                      date={new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      time={`${event.event_start_time?.slice(0, 5)} - ${event.event_end_time?.slice(0, 5)}`}
                      location={event.location}
                      attendees={event.attendee_count || 0}
                      description={event.description}
                      tags={event.tags}
                      image={event.event_image}
                      isFavorite={true}
                      onFavoriteClick={() => toggleEventFavorite(event.event_id)}
                      createdAt={event.event_created_at || event.created_at}
                    />
                  ))}
                </div>
                {savedEventsData.length > itemsPerPage && (
                  <Pagination
                    currentPage={savedEventsPage}
                    totalPages={getTotalPages(savedEventsData)}
                    onPageChange={setSavedEventsPage}
                  />
                )}
              </TabsContent>

              <TabsContent value="registered-events">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedRegisteredEvents.map((event) => (
                    <EventCard
                      key={event.event_id}
                      eventId={event.event_id}
                      title={event.title}
                      organiser={event.organiser}
                      date={new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      time={`${event.event_start_time?.slice(0, 5)} - ${event.event_end_time?.slice(0, 5)}`}
                      location={event.location}
                      attendees={event.attendee_count || 0}
                      description={event.description}
                      tags={event.tags}
                      image={event.event_image}
                      isFavorite={eventFavorites.has(event.event_id)}
                      onFavoriteClick={() => toggleEventFavorite(event.event_id)}
                      createdAt={event.event_created_at || event.created_at}
                    />
                  ))}
                </div>
                {registeredEventsData.length > itemsPerPage && (
                  <Pagination
                    currentPage={registeredEventsPage}
                    totalPages={getTotalPages(registeredEventsData)}
                    onPageChange={setRegisteredEventsPage}
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

