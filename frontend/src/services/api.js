// API Configuration
// Switch between test and production environments

const API_URLS = {
  development: 'http://localhost:9090/api',
  production: 'https://your-production-url.com/api', // Update with actual production URL
  test: 'http://localhost:9090/api'
};

// Set current environment - change this to switch between environments
const CURRENT_ENV = process.env.NODE_ENV || 'development';

export const API_BASE_URL = API_URLS[CURRENT_ENV];

// Helper function to handle API responses
export const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ 
      message: 'An error occurred' 
    }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
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
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
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
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// Generic PATCH request
export const apiPatch = async (endpoint, data, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// Generic DELETE request
export const apiDelete = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
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
