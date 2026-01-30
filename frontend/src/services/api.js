// API Configuration
// Uses environment variable for security and flexibility

// Get API URL from environment variable, fallback to localhost for development
// Note: Vite uses import.meta.env instead of process.env
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';


// Helper function to show toast notification
const showToast = (message, type = 'warning') => {
  // Remove any existing toast
  const existingToast = document.getElementById('session-expired-toast');
  if (existingToast) {
    existingToast.remove();
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.id = 'session-expired-toast';
  toast.className = 'fixed top-4 right-4 z-[9999] flex items-center gap-3 px-6 py-4 rounded-xl border backdrop-blur-sm shadow-lg';
  
  // Style based on type
  if (type === 'warning') {
    toast.className += ' bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
  }
  
  // Add content
  toast.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
    <span class="text-sm font-medium">${message}</span>
  `;
  
  // Add to document
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.style.animation = 'slideInFromTop 0.3s ease-out';
  }, 10);
};

// Helper function to handle API responses
export const handleResponse = async (response, endpoint = '') => {
  if (!response.ok) {
    // Handle token expiration (401 Unauthorized)
    // BUT exclude login/signup endpoints where 401 means wrong credentials
    const isAuthEndpoint = endpoint.includes('/tokens') || 
                          endpoint.includes('/login') || 
                          endpoint.includes('/signup') ||
                          endpoint.includes('/forgot-password') ||
                          endpoint.includes('/reset-password');
    
    if (response.status === 401 && !isAuthEndpoint) {
      // Show toast notification
      showToast('Session expired. Please Log In!', 'warning');
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      localStorage.removeItem('userId');
      
      // Wait 5 seconds before redirecting
      setTimeout(() => {
        window.location.href = '/login';
      }, 5000);
      
      const error = new Error('Session expired. Please log in again.');
      error.response = {
        status: 401,
        data: { message: 'Session expired' }
      };
      throw error;
    }
    
    const errorData = await response.json().catch(() => ({ 
      message: 'An error occurred' 
    }));
    const error = new Error(errorData.msg || errorData.message || `HTTP error! status: ${response.status}`);
    error.response = {
      status: response.status,
      data: errorData
    };
    throw error;
  }
  return response.json();
};

// Helper function to handle API errors
export const handleError = (error) => {
  console.error('API Error:', error);
  throw error;
};

// Generic GET request
export const apiGet = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
      ...options,
    });
    return handleResponse(response, endpoint);
  } catch (error) {
    return handleError(error);
  }
};

// Generic POST request
export const apiPost = async (endpoint, data, options = {}) => {
  try {
    const token = localStorage.getItem('token');
    const isFormData = data instanceof FormData;
    
    const headers = {
      ...options.headers,
    };
    
    // Only set Content-Type for non-FormData requests
    // FormData sets its own Content-Type with boundary
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const fetchOptions = {
      method: 'POST',
      headers,
      ...options,
    };
    
    // Set body based on data type
    if (isFormData) {
      fetchOptions.body = data;
    } else {
      fetchOptions.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
    return handleResponse(response, endpoint);
  } catch (error) {
    return handleError(error);
  }
};

// Generic PATCH request
export const apiPatch = async (endpoint, data, options = {}) => {
  try {
    const token = localStorage.getItem('token');
    const isFormData = data instanceof FormData;
    
    const headers = {
      ...options.headers,
    };
    
    // Only set Content-Type for non-FormData requests
    // FormData sets its own Content-Type with boundary
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const fetchOptions = {
      method: 'PATCH',
      headers,
      ...options,
    };
    
    // Set body based on data type
    if (isFormData) {
      fetchOptions.body = data;
    } else {
      fetchOptions.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
    return handleResponse(response, endpoint);
  } catch (error) {
    return handleError(error);
  }
};

// Generic DELETE request
export const apiDelete = async (endpoint, data = null, options = {}) => {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const fetchOptions = {
      method: 'DELETE',
      headers,
      ...options,
    };
    
    // Add body if data is provided
    if (data) {
      fetchOptions.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
    return handleResponse(response, endpoint);
  } catch (error) {
    return handleError(error);
  }
};

// Helper to build query strings
export const buildQueryString = (params) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value);
    }
  });
  return query.toString() ? `?${query.toString()}` : '';
};
