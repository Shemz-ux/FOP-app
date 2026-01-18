import { apiGet, apiPost, apiPatch, apiDelete } from './api';

// Get all jobseekers (admin only)
export const getJobseekers = async (adminToken) => {
  const data = await apiGet('/jobseekers', {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return data.jobseekers;
};

// Get single jobseeker by ID
export const getJobseekerById = async (jobseekerId, token) => {
  const data = await apiGet(`/jobseekers/${jobseekerId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return data.jobseeker;
};

// Create new jobseeker (registration)
export const createJobseeker = async (jobseekerData) => {
  const data = await apiPost('/jobseekers', jobseekerData);
  return data.newJobseeker;
};

// Update jobseeker profile
export const updateJobseeker = async (jobseekerId, jobseekerData, token) => {
  const data = await apiPatch(`/jobseekers/${jobseekerId}`, jobseekerData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return data.jobseeker;
};

// Delete jobseeker account
export const deleteJobseeker = async (jobseekerId, token) => {
  const data = await apiDelete(`/jobseekers/${jobseekerId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return data.msg;
};

// Get jobseeker dashboard
export const getJobseekerDashboard = async (jobseekerId, token, options = {}) => {
  const { paginated, applied_limit, applied_offset, saved_limit, saved_offset } = options;
  
  let endpoint = `/jobseekers/${jobseekerId}/dashboard`;
  
  if (paginated) {
    const params = new URLSearchParams({
      paginated: 'true',
      applied_limit: applied_limit || 10,
      applied_offset: applied_offset || 0,
      saved_limit: saved_limit || 10,
      saved_offset: saved_offset || 0
    });
    endpoint += `?${params.toString()}`;
  }
  
  const data = await apiGet(endpoint, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return data.dashboard;
};

// Get jobseeker applied jobs
export const getJobseekerAppliedJobs = async (jobseekerId, token) => {
  const data = await apiGet(`/jobseekers/${jobseekerId}/applied-jobs`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return data.applied_jobs;
};

// Get jobseeker saved jobs
export const getJobseekerSavedJobs = async (jobseekerId, token) => {
  const data = await apiGet(`/jobseekers/${jobseekerId}/saved-jobs`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return data.saved_jobs;
};

// Get jobseeker applied events
export const getJobseekerAppliedEvents = async (jobseekerId, token) => {
  const data = await apiGet(`/jobseekers/${jobseekerId}/applied-events`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return data.applied_events;
};

// Get jobseeker saved events
export const getJobseekerSavedEvents = async (jobseekerId, token) => {
  const data = await apiGet(`/jobseekers/${jobseekerId}/saved-events`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return data.saved_events;
};

// Apply for a job
export const applyForJob = async (jobseekerId, jobId, token) => {
  const data = await apiPost(`/jobseekers/${jobseekerId}/apply-job/${jobId}`, {}, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return data.msg;
};

// Save a job
export const saveJob = async (jobseekerId, jobId, token) => {
  const data = await apiPost(`/jobseekers/${jobseekerId}/save-job/${jobId}`, {}, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return data.msg;
};

// Unsave a job
export const unsaveJob = async (jobseekerId, jobId, token) => {
  const data = await apiDelete(`/jobseekers/${jobseekerId}/save-job/${jobId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return data.msg;
};

// Apply for an event
export const applyForEvent = async (jobseekerId, eventId, token) => {
  const data = await apiPost(`/jobseekers/${jobseekerId}/apply-event/${eventId}`, {}, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return data.msg;
};

// Save an event
export const saveEvent = async (jobseekerId, eventId, token) => {
  const data = await apiPost(`/jobseekers/${jobseekerId}/save-event/${eventId}`, {}, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return data.msg;
};

// Unsave an event
export const unsaveEvent = async (jobseekerId, eventId, token) => {
  const data = await apiDelete(`/jobseekers/${jobseekerId}/save-event/${eventId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return data.msg;
};
