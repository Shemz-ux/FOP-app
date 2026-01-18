import { apiGet, apiPatch } from '../api';

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
