// API Configuration
// Uses environment variable for security and flexibility

// Get API URL from environment variable, fallback to localhost for development
// Note: Vite uses import.meta.env instead of process.env
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';


// Helper function to handle API responses
export const handleResponse = async (response) => {
  if (!response.ok) {
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
    return handleResponse(response);
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
    return handleResponse(response);
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
    return handleResponse(response);
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
    return handleResponse(response);
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
