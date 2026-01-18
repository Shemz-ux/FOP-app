import { apiGet, apiPost, apiPatch, apiDelete } from '../api';

// Get all societies
export const getSocieties = async () => {
  const data = await apiGet('/societies');
  return data.societies;
};

// Get single society by ID
export const getSocietyById = async (societyId, token) => {
  const data = await apiGet(`/societies/${societyId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return data.society;
};

// Create new society (registration)
export const createSociety = async (societyData) => {
  const data = await apiPost('/societies', societyData);
  return data.newSociety;
};

// Update society profile
export const updateSociety = async (societyId, societyData, token) => {
  const data = await apiPatch(`/societies/${societyId}`, societyData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return data.society;
};

// Delete society account
export const deleteSociety = async (societyId, token) => {
  const data = await apiDelete(`/societies/${societyId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return data.msg;
};

// Get society dashboard
export const getSocietyDashboard = async (societyId, token) => {
  const data = await apiGet(`/societies/${societyId}/dashboard`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return data.dashboard;
};

// Get society saved jobs
export const getSocietySavedJobs = async (societyId, token) => {
  const data = await apiGet(`/societies/${societyId}/saved-jobs`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return data.saved_jobs;
};

// Get society saved events
export const getSocietySavedEvents = async (societyId, token) => {
  const data = await apiGet(`/societies/${societyId}/saved-events`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return data.saved_events;
};

// Save a job
export const societySaveJob = async (societyId, jobId, token) => {
  const data = await apiPost(`/societies/${societyId}/save-job/${jobId}`, {}, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return data.msg;
};

// Unsave a job
export const societyUnsaveJob = async (societyId, jobId, token) => {
  const data = await apiDelete(`/societies/${societyId}/save-job/${jobId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return data.msg;
};

// Save an event
export const societySaveEvent = async (societyId, eventId, token) => {
  const data = await apiPost(`/societies/${societyId}/save-event/${eventId}`, {}, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return data.msg;
};

// Unsave an event
export const societyUnsaveEvent = async (societyId, eventId, token) => {
  const data = await apiDelete(`/societies/${societyId}/save-event/${eventId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return data.msg;
};
