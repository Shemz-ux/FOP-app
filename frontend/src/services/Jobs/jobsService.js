import { apiGet, apiPost, apiPatch, apiDelete, buildQueryString } from '../api';
import { addJobTags, addJobTagsToList } from '../../utils/tagGenerator';

// Get all jobs with optional filters
export const getJobs = async (filters = {}) => {
  const queryString = buildQueryString(filters);
  const data = await apiGet(`/jobs${queryString}`);
  return addJobTagsToList(data.jobs);
};

// Get jobs with advanced filtering
export const getJobsAdvanced = async (filters = {}) => {
  const queryString = buildQueryString(filters);
  const data = await apiGet(`/jobs/search${queryString}`);
  return {
    ...data,
    jobs: addJobTagsToList(data.jobs || [])
  };
};

// Get available job filter options
export const getJobFilters = async () => {
  const data = await apiGet('/jobs/filters');
  return data.filters;
};

// Get single job by ID
export const getJobById = async (jobId) => {
  const data = await apiGet(`/jobs/${jobId}`);
  return addJobTags(data.job);
};

// Create new job (admin only)
export const createJob = async (jobData, adminToken) => {
  const data = await apiPost('/jobs', jobData, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return addJobTags(data.newJob);
};

// Update job (admin only)
export const updateJob = async (jobId, jobData, adminToken) => {
  const data = await apiPatch(`/jobs/${jobId}`, jobData, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return addJobTags(data.job);
};

// Delete job (admin only)
export const deleteJob = async (jobId, adminToken) => {
  const data = await apiDelete(`/jobs/${jobId}`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return data.msg;
};

// Get active jobs only
export const getActiveJobs = async () => {
  const data = await apiGet('/jobs?active=true');
  return addJobTagsToList(data.jobs);
};

// Get jobs by company
export const getJobsByCompany = async (companyName) => {
  const data = await apiGet(`/jobs?company=${encodeURIComponent(companyName)}`);
  return addJobTagsToList(data.jobs);
};
