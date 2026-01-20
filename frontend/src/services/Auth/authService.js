import { apiPost } from '../api';

// Unified login for all user types (jobseeker, society, admin)
export const login = async (email, password) => {
  const data = await apiPost('/tokens', { email, password });
  // API returns: { token, user_id, user_type, role?, name?, message }
  if (data.token) {
    saveUser(data.token, data.user_type, data.user_id, data.role, data.name);
  }
  return data;
};

// Logout (clear local storage)
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userType');
  localStorage.removeItem('userId');
  localStorage.removeItem('role');
  localStorage.removeItem('userName');
};

// Get current user from local storage
export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('userName');
  
  console.log('authService - getCurrentUser - Retrieved from localStorage:', { 
    hasToken: !!token, 
    userType, 
    userId, 
    role, 
    name 
  });
  
  if (token && userType && userId) {
    return {
      token,
      userType,
      userId,
      role: role || null,
      name: name || null
    };
  }
  
  return null;
};

// Save user to local storage
export const saveUser = (token, userType, userId, role = null, name = null) => {
  console.log('authService - saveUser called with:', { token: '***', userType, userId, role, name });
  localStorage.setItem('token', token);
  localStorage.setItem('userType', userType);
  localStorage.setItem('userId', userId);
  if (role) {
    localStorage.setItem('role', role);
  }
  // Always set userName, even if null/empty
  localStorage.setItem('userName', name || '');
  console.log('authService - userName saved to localStorage:', localStorage.getItem('userName'));
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
