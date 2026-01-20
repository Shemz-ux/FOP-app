import { apiGet, apiPatch, apiDelete } from '../api';

// Get user profile data based on user type
export const getUserProfile = async (userId, userType) => {
  let endpoint;
  if (userType === 'jobseeker') {
    endpoint = `/jobseekers/${userId}`;
  } else if (userType === 'society') {
    endpoint = `/societies/${userId}`;
  } else if (userType === 'admin') {
    endpoint = `/admin/users/${userId}`;
  }
  
  const data = await apiGet(endpoint);
  return data;
};

// Update user profile
export const updateUserProfile = async (userId, userType, profileData) => {
  let endpoint;
  if (userType === 'jobseeker') {
    endpoint = `/jobseekers/${userId}`;
  } else if (userType === 'society') {
    endpoint = `/societies/${userId}`;
  } else if (userType === 'admin') {
    endpoint = `/admin/users/${userId}`;
  }
  
  const data = await apiPatch(endpoint, profileData);
  return data;
};

// Delete jobseeker account
export const deleteJobseeker = async (userId) => {
  const data = await apiDelete(`/jobseekers/${userId}`);
  return data;
};

// Delete society account
export const deleteSociety = async (userId) => {
  const data = await apiDelete(`/societies/${userId}`);
  return data;
};

// Delete admin account
export const deleteAdmin = async (userId) => {
  const data = await apiDelete(`/admin/users/${userId}`);
  return data;
};
