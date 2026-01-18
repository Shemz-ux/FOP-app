import { apiPost } from './api';

// Login for jobseekers
export const loginJobseeker = async (email, password) => {
  const data = await apiPost('/auth/jobseeker/login', { email, password });
  return data;
};

// Login for societies
export const loginSociety = async (email, password) => {
  const data = await apiPost('/auth/society/login', { email, password });
  return data;
};

// Login for admin users
export const loginAdmin = async (email, password) => {
  const data = await apiPost('/auth/admin/login', { email, password });
  return data;
};

// Logout (clear local storage)
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userType');
  localStorage.removeItem('userId');
  localStorage.removeItem('user');
};

// Get current user from local storage
export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');
  const userId = localStorage.getItem('userId');
  const user = localStorage.getItem('user');
  
  if (token && userType && userId) {
    return {
      token,
      userType,
      userId,
      user: user ? JSON.parse(user) : null
    };
  }
  
  return null;
};

// Save user to local storage
export const saveUser = (token, userType, userId, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('userType', userType);
  localStorage.setItem('userId', userId);
  localStorage.setItem('user', JSON.stringify(user));
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Check if user is admin
export const isAdmin = () => {
  return localStorage.getItem('userType') === 'admin';
};

// Check if user is jobseeker
export const isJobseeker = () => {
  return localStorage.getItem('userType') === 'jobseeker';
};

// Check if user is society
export const isSociety = () => {
  return localStorage.getItem('userType') === 'society';
};

// Get auth token
export const getAuthToken = () => {
  return localStorage.getItem('token');
};
