import { apiGet } from '../api';

// Get user's saved jobs
export const getSavedJobs = async (userId, userType) => {
  const endpoint = userType === 'jobseeker'
    ? `/jobseekers/${userId}/saved-jobs`
    : `/societies/${userId}/saved-jobs`;
  
  const data = await apiGet(endpoint);
  return data.saved_jobs || [];
};

// Get all saved job IDs for checking saved status
export const getSavedJobIds = async (userId, userType) => {
  const savedJobs = await getSavedJobs(userId, userType);
  return savedJobs.map(job => job.job_id);
};

// Get user's applied jobs (jobseekers only)
export const getAppliedJobs = async (userId) => {
  const data = await apiGet(`/jobseekers/${userId}/applied-jobs`);
  return data.applied_jobs || [];
};

// Get user's saved events
export const getSavedEvents = async (userId, userType) => {
  const endpoint = userType === 'jobseeker'
    ? `/jobseekers/${userId}/saved-events`
    : `/societies/${userId}/saved-events`;
  
  const data = await apiGet(endpoint);
  return data.saved_events || [];
};

// Get all saved event IDs for checking saved status
export const getSavedEventIds = async (userId, userType) => {
  const savedEvents = await getSavedEvents(userId, userType);
  return savedEvents.map(event => event.event_id);
};

// Get user's registered events (jobseekers only - societies cannot register)
export const getRegisteredEvents = async (userId, userType) => {
  if (userType !== 'jobseeker') {
    return []; // Societies cannot register for events
  }
  
  const endpoint = `/jobseekers/${userId}/applied-events`;
  const data = await apiGet(endpoint);
  return data.applied_events || [];
};
