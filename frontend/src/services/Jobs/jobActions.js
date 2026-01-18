import { apiPost, apiDelete, apiGet } from '../api';

// Save a job
export const saveJob = async (jobId, userId, userType) => {
  const endpoint = userType === 'jobseeker' 
    ? `/jobseekers/${userId}/save/${jobId}`
    : `/societies/${userId}/save-job/${jobId}`;
  
  const data = await apiPost(endpoint, {});
  return data;
};

// Unsave a job
export const unsaveJob = async (jobId, userId, userType) => {
  const endpoint = userType === 'jobseeker'
    ? `/jobseekers/${userId}/save/${jobId}`
    : `/societies/${userId}/save-job/${jobId}`;
  
  const data = await apiDelete(endpoint);
  return data;
};

// Check if job is saved
export const checkJobSaved = async (jobId, userId, userType) => {
  const endpoint = userType === 'jobseeker'
    ? `/jobseekers/${userId}/saved-jobs`
    : `/societies/${userId}/saved-jobs`;
  
  const data = await apiGet(endpoint);
  const savedJobs = data.saved_jobs || [];
  return savedJobs.some(job => job.job_id === parseInt(jobId));
};

// Apply to a job (jobseekers only)
export const applyToJob = async (jobId, userId) => {
  const data = await apiPost(`/jobseekers/${userId}/apply/${jobId}`, {});
  return data;
};

// Check if applied to job
export const checkJobApplied = async (jobId, userId) => {
  const data = await apiGet(`/jobseekers/${userId}/applied-jobs`);
  const appliedJobs = data.applied_jobs || [];
  return appliedJobs.some(job => job.job_id === parseInt(jobId));
};
